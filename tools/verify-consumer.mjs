import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const temporary = mkdtempSync(join(tmpdir(), 'ceenjs6-consumer-'));
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const fixture = readFileSync(join(root, 'docs/smoke/ceenjs-smoke.ts'), 'utf8')
    .replace(/^\/\/\/ <reference.*\r?\n/, '') + `
// @ts-expect-error JSOX Array extensions are disabled in an ordinary project.
[1, 2].distinct();
// @ts-expect-error JSOX Number extensions are disabled in an ordinary project.
Number.parseFloat('ff', 16);
// @ts-expect-error JSOX Math extensions are disabled in an ordinary project.
Math.random(1, 2);
`;

function check(directory, config) {
    writeFileSync(join(directory, 'main.ts'), fixture);
    const configPath = join(directory, 'jsconfig.json');
    writeFileSync(configPath, JSON.stringify(config));
    const parsed = ts.parseJsonConfigFileContent(config, ts.sys, directory, {}, configPath);
    assert.equal(parsed.errors.length, 0);
    assert(!parsed.fileNames.some(file => /cj6-jsox-.*extensions\.d\.ts$/.test(file)),
        'Optional JSOX declarations were automatically included');
    const options = {...parsed.options, strict: true, noEmit: true};
    const host = ts.createCompilerHost(options);
    host.getCurrentDirectory = () => directory;
    const program = ts.createProgram(parsed.fileNames, options, host);
    const diagnostics = ts.getPreEmitDiagnostics(program);
    assert.equal(diagnostics.length, 0, diagnostics.map(d =>
        `${d.file?.fileName}: ${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`).join('\n'));
    return {diagnostics: diagnostics.length, jsoxDisabled: true};
}

try {
    const config = JSON.parse(readFileSync(join(root, 'jsconfig.json'), 'utf8'));
    const local = join(temporary, 'local');
    mkdirSync(local);
    cpSync(join(root, 'declarations'), join(local, 'declarations'), {recursive: true});
    const localReport = check(local, config);

    const pack = JSON.parse(execFileSync(npm,
        ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary],
        {cwd: root, encoding: 'utf8'}))[0];
    const installed = join(temporary, 'installed');
    mkdirSync(installed);
    writeFileSync(join(installed, 'package.json'), '{"private":true}\n');
    // npm 11 passes its script authorization flag to lifecycle commands, but
    // rejects that CLI-only flag in a nested project install. Scripts stay off.
    const installEnv = Object.fromEntries(Object.entries(process.env)
        .filter(([key]) => !/^npm_config_allow_scripts$/i.test(key)));
    execFileSync(npm, ['install', join(temporary, pack.filename), '--ignore-scripts',
        '--no-package-lock', '--no-audit', '--no-fund'], {cwd: installed, env: installEnv, stdio: 'pipe'});
    const npmReport = check(installed, config);
    // Standard TypeScript consumers can also use the package's own types entry.
    const packageTypesReport = check(installed, {compilerOptions: {
        target: 'ES2020', lib: ['ES2020'], types: ['ceenjs6'], skipLibCheck: true,
    }});
    process.stdout.write(JSON.stringify({typescript: ts.version, package: pack.id,
        local: localReport, npm: npmReport, packageTypes: packageTypesReport}, null, 2) + '\n');
} finally {
    rmSync(temporary, {recursive: true, force: true});
}
