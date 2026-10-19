# Release and npm publication

The maintained branch is `ceen`. The package is `ceenjs6`; CeenJs6 maintenance
starts at 5.0.0, with 4.42.0 retained as upstream history. This is a declaration
package, so building means checking types and assembling distributable files.

## Automatic GitHub Releases

The `CeenJs6 checks and release` workflow runs on pushes to `ceen`, `v*` tags,
pull requests, and manual dispatch. It runs the API, JSOX isolation, completion,
Compose TSX, colors, terminal, real consumer installation and documentation
checks before packaging anything.

A successful push to `ceen` automatically creates `v<package.json version>`
and a GitHub Release with these assets:

- `ceenjs6-<version>.tgz`: the verified npm package, also installable directly.
- `ceenjs6-<version>.zip`: the same files in a standalone directory.
- `release-metadata.json`: source commit, npm integrity and package inventory.
- `SHA256SUMS`: SHA-256 checksums for the three files above.

Pull requests only validate and upload temporary workflow artifacts. Tags must
match the version in package.json. An existing version attached to a different
commit is left alone; bump the package version and add matching entries in all
ten `.changelog/lang_*.json` files before the next release. Re-running a release
at its original commit can restore its assets without moving its tag.

To prepare a release locally:

```shell
npm install --ignore-scripts --no-package-lock
npm run docs:generate
npm run docs:check
npm run docs:test
npm test
npm run release:prepare
```

Artifacts are written to ignored `dist/`. `release:prepare` checks every packed
declaration reference, rejects obsolete runtime names, verifies the ZIP and
creates checksums. It does not publish. CI repeats all checks on the committed
source before creating a Release.

Until npm publication is configured, the checked GitHub asset is installable:

```shell
npm install https://github.com/suminwell/CeenJs6-TypeScript-Declarations/releases/download/v5.0.0/ceenjs6-5.0.0.tgz
```

## npm registry

GitHub Releases work without npm credentials. The separate npm job is enabled
by repository variable `NPM_PUBLISH_ENABLED=true`, or by selecting `publish_npm`
when manually running the workflow at the release commit/tag. Set up one of:

1. **Trusted publishing (recommended).** After the package exists, configure
   its npm publishing settings for GitHub Actions, owner `suminwell`, repository
   `CeenJs6-TypeScript-Declarations`, workflow `release.yml`, with no environment
   restriction. Set repository variables `NPM_TRUSTED_PUBLISHER=true` and
   `NPM_PUBLISH_ENABLED=true`. CI uses npm 11 and GitHub OIDC, with no npm token.
2. **Granular token.** Add a publishing token authorized for `ceenjs6` as the
   `NPM_TOKEN` repository secret and set `NPM_PUBLISH_ENABLED=true`. Use a token
   allowed to publish unattended under the account's 2FA policy. Renew it
   before expiry. Leave `NPM_TRUSTED_PUBLISHER` unset or false.

The first registry publication requires an npm account authorized to claim
`ceenjs6`. It can be made from an authenticated terminal with
`npm publish dist/ceenjs6-5.0.0.tgz --access public`, or from Actions with a token.
Complete any npm login/2FA interaction in the npm UI; do not commit credentials.

The npm job publishes the exact tarball already checked and attached to the
GitHub Release, with provenance. It verifies the registry's SHA-512 integrity.
An identical existing version is skipped; a different package at the same
version fails. A missing credential or failed npm job does not remove the
GitHub Release. Re-run at the release commit/tag to retry npm publication.
