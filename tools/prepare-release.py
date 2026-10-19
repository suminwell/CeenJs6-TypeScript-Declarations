"""Pack and verify npm/standalone assets without publishing or using credentials."""
from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import posixpath
import re
import shutil
import subprocess
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', type=Path, default=ROOT / 'dist')
    args = parser.parse_args()
    output = args.out.resolve()
    output.mkdir(parents=True, exist_ok=True)
    package = json.loads((ROOT / 'package.json').read_text())
    version = package['version']
    if package['name'] != 'ceenjs6' or not re.fullmatch(r'\d+\.\d+\.\d+', version):
        raise SystemExit('Expected ceenjs6 with a stable three-component version')
    if os.environ.get('GITHUB_REF_TYPE') == 'tag' and os.environ['GITHUB_REF_NAME'] != 'v' + version:
        raise SystemExit('Tag does not match package.json version')
    npm = shutil.which('npm')
    if not npm:
        raise SystemExit('npm is required')
    packed = json.loads(subprocess.check_output(
        [npm, 'pack', '--ignore-scripts', '--json', '--pack-destination', str(output)],
        cwd=ROOT, text=True))[0]
    tarball = output / packed['filename']
    files = {}
    with tarfile.open(tarball, 'r:gz') as archive:
        for item in archive.getmembers():
            path = PurePosixPath(item.name)
            if not item.isfile() or not item.name.startswith('package/') or '..' in path.parts:
                raise SystemExit(f'Unexpected npm archive member: {item.name}')
            files[str(path.relative_to('package'))] = archive.extractfile(item).read()
    required = {package['types'], 'jsconfig.json', 'LICENSE', 'NOTICE',
                'README.md', 'docs/COMPATIBILITY.md', 'docs/RELEASING.md'}
    if not required <= files.keys():
        raise SystemExit(f'Missing package files: {sorted(required - files.keys())}')
    references = 0
    for name, content in files.items():
        if not name.endswith('.d.ts'):
            continue
        text = content.decode()
        if re.search(r'autojs|aj6-|ceenjs6\.com', text, re.IGNORECASE) or 'autojs' in name.lower():
            raise SystemExit(f'Obsolete runtime identity in {name}')
        for reference in re.findall(r'///\s*<reference\s+path=["\']([^"\']+)', text):
            references += 1
            target = posixpath.normpath(posixpath.join(posixpath.dirname(name), reference))
            if target not in files:
                raise SystemExit(f'Broken packed declaration reference: {name} -> {reference}')
    standalone = output / f'ceenjs6-{version}.zip'
    with zipfile.ZipFile(standalone, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
        for name, content in sorted(files.items()):
            info = zipfile.ZipInfo(f'ceenjs6-{version}/{name}', (1985, 10, 26, 8, 15, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, content)
    with zipfile.ZipFile(standalone) as archive:
        assert archive.testzip() is None
        assert len(archive.infolist()) == len(files)
    commit = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip()
    metadata = output / 'release-metadata.json'
    metadata.write_text(json.dumps({
        'name': package['name'], 'version': version, 'tag': 'v' + version,
        'commit': commit, 'npm_integrity': packed['integrity'],
        'files': len(files), 'declaration_references': references,
        'host_repository': 'https://github.com/suminwell/CeenJs6',
        'host_baseline': 'f2fb49d48898a5e28deb6af1ff521a9c9bcb2a5c',
    }, indent=2) + '\n')
    checksums = output / 'SHA256SUMS'
    checksums.write_text(''.join(
        f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n'
        for path in sorted((tarball, standalone, metadata))))
    changelog = json.loads((ROOT / '.changelog/lang_zh-Hans.json').read_text())
    entry = changelog['$data']['v' + version]
    notes = [f'CeenJs6 TypeScript Declarations {version} (`npm install ceenjs6`)', '',
             f'Source: `{commit}`', '', f"Release date: {entry['released_date']}", '']
    for item in entry['entries']:
        notes += [f"### {item['heading']}", ''] if 'heading' in item else [
            f"- `{changelog['labels'][item['category']]}` {item['text']}"]
    notes += ['', 'Assets: npm `.tgz`, standalone `.zip`, release metadata and SHA-256 checksums.', '',
              'The complete API surface is retained. The current CeenJs6 6.7.0 host requires feature ports',
              'and matching plugins for newer 6.8.0 APIs. See docs/COMPATIBILITY.md in either archive.', '',
              'GitHub assets are available independently of npm registry publication.', '']
    (output / 'release-notes.md').write_text('\n'.join(notes), encoding='utf-8')
    print(json.dumps({'package': packed['id'], 'output': str(output),
                      'files': len(files), 'references': references,
                      'assets': [tarball.name, standalone.name, metadata.name, checksums.name]}, indent=2))


if __name__ == '__main__':
    main()
