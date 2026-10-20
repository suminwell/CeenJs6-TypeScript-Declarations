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

Install the package from the official npm registry:

```shell
npm install ceenjs6
```

The checked GitHub asset is also installable independently of npm:

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
   restriction. Enable **Allow npm publish**; staged publishing permission
   alone does not authorize this workflow's direct publication. Complete npm's
   security-key confirmation to save the connection. A saved connection may
   show **Pending validation** until the first successful OIDC publication;
   publish a new version before the deadline displayed by npm to validate it.
   Set repository variables `NPM_TRUSTED_PUBLISHER=true` and
   `NPM_PUBLISH_ENABLED=true`. CI uses npm 11 and GitHub OIDC, with no npm token.
2. **Granular token.** Add a publishing token authorized for `ceenjs6` as the
   `NPM_TOKEN` repository secret and set `NPM_PUBLISH_ENABLED=true`. Use a token
   allowed to publish unattended under the account's 2FA policy. Renew it
   before expiry. Leave `NPM_TRUSTED_PUBLISHER` unset or false.

The first registry publication requires an npm account authorized to claim
`ceenjs6`. Download the tarball from the checked GitHub Release for this step;
do not substitute a locally repacked copy. Different npm/Node compression
versions can produce different archive integrity even with identical files.

```shell
gh release download v5.0.0 --repo suminwell/CeenJs6-TypeScript-Declarations --pattern ceenjs6-5.0.0.tgz --dir dist/registry
npm login --auth-type=web --registry=https://registry.npmjs.org/
```

A browser login or email login code does not necessarily authorize direct
publication. Direct `npm publish dist/registry/ceenjs6-5.0.0.tgz --access public`
requires the account's publishing 2FA or a token permitted by npm's policy.
For the initial publication, npm 11.19 also supports staging the exact tarball
and confirming publication separately:

```shell
npm stage publish dist/registry/ceenjs6-5.0.0.tgz --access public
npm stage view <stage-id>
npm stage approve <stage-id>
```

Wait for npm's automated review to finish before approving. The staged package
page also shows the review state and allows approval. A staged upload is not
a published registry version. If approval redirects to account 2FA setup,
the account owner must enroll a passkey/security key in the official UI first;
an email login code alone does not enroll account 2FA. Then approve the existing
stage rather than uploading another copy. Run interactive authorization
commands in a terminal and complete npm login/2FA in the official UI; do not
commit credentials.

The npm job publishes the exact tarball already checked and attached to the
GitHub Release, with provenance. It verifies the registry's SHA-512 integrity.
An identical existing version is skipped; a different package at the same
version fails. A missing credential or failed npm job does not remove the
GitHub Release. Re-run at the release commit/tag to retry npm publication.
