import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {appendFileSync, readFileSync} from 'node:fs';

const metadata = JSON.parse(readFileSync('dist/release-metadata.json', 'utf8'));
assert.equal(metadata.name, 'ceenjs6');
assert.match(metadata.version, /^\d+\.\d+\.\d+$/);
if (process.env.RELEASE_VERSION) assert.equal(metadata.version, process.env.RELEASE_VERSION);
const tarball = `dist/ceenjs6-${metadata.version}.tgz`;
const integrity = 'sha512-' + createHash('sha512').update(readFileSync(tarball)).digest('base64');
assert.equal(integrity, metadata.npm_integrity, 'Tarball differs from the checked package');
const registryUrl = `https://registry.npmjs.org/ceenjs6/${metadata.version}`;

async function publishedIntegrity() {
    const response = await fetch(registryUrl, {signal: AbortSignal.timeout(30_000)});
    if (response.status === 404) return undefined;
    assert(response.ok, `npm registry returned HTTP ${response.status}`);
    return (await response.json()).dist.integrity;
}

const existing = await publishedIntegrity();
if (existing) {
    assert.equal(existing, integrity, 'This npm version exists with different content; bump the version');
    console.log(`ceenjs6@${metadata.version} is already published with the verified integrity`);
} else {
    const result = spawnSync('npm', ['publish', tarball, '--access', 'public', '--provenance'], {stdio: 'inherit'});
    assert.equal(result.status, 0, `npm publish failed: ${result.error || result.status}`);
    let published;
    for (let attempt = 0; attempt < 5; attempt++) {
        published = await publishedIntegrity();
        if (published) break;
        await new Promise(resolve => setTimeout(resolve, 2_000));
    }
    assert.equal(published, integrity, 'Published registry integrity differs from the checked tarball');
}
if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY,
        `Published and verified: https://www.npmjs.com/package/ceenjs6/v/${metadata.version}\n`);
}
