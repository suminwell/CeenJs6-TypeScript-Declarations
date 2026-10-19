# CeenJs6 compatibility

The npm package is `ceenjs6`. Its type entry is
`declarations/ceenjs6/index.d.ts`. Individual declaration files use the `cj6-`
prefix. Replace references to the former package and entry when migrating.

The runtime names follow [suminwell/CeenJs6](https://github.com/suminwell/CeenJs6):

| API | CeenJs6 name |
| --- | --- |
| Script host | `ceenjs`, `$ceenjs`, `app.ceenjs` |
| Host type | `Internal.Ceenjs` |
| Java packages | `org.ceenjs.ceenjs`, `com.stardust.ceenjs` |
| Application and resources | `org.ceenjs.ceenjs6` |
| TSX namespace | `CeenJs6Tsx` |
| Classic TSX factories | `__ceenjs6Tsx`, `__ceenjs6TsxFragment` |

The names and host module were checked against CeenJs6 commit
`f2fb49d48898a5e28deb6af1ff521a9c9bcb2a5c`, released as `ceen-v6.7.0.2`.
That host uses the 6.7.0 runtime baseline. This package intentionally retains
the complete newer declaration surface inherited from declaration version
4.42.0. A declaration or completion is not a runtime capability check.

## Newer host and plugin APIs

The current 6.7.0 host does not register the newer `ai`/`tts`, `compose`,
`flow`, `installer`, `mail`, `epub`, `gallery`, `terminal`, `settings`,
`powerManager`/`power_manager` and `workManager` modules. It also lacks newer
members such as `plugins.tools` and `files.batchRename`. Use these only after
the corresponding features have been ported to CeenJs6, with any required
plugins installed and enabled. Renaming the type does not install a plugin
or add the feature to the host.

JSDoc and the inherited changelog retain per-feature minimum versions and
plugin requirements. References to host 6.8.0 and numeric upstream build
requirements describe the required feature level; CeenJs6's independent
maintenance build numbers do not satisfy them by numerical comparison.
The retained TSX declarations likewise require a matching TypeScript Engine
and rendering plugin using the CeenJs6 factory names above.

Before calling a feature that may be absent, check it in the running host:

```javascript
if (typeof ceenjs !== 'undefined') {
    console.log(ceenjs.versionName, ceenjs.packageName);
}
if (typeof plugins.tools !== 'undefined') {
    console.log(plugins.tools.list());
}
```

## Editors and JSOX

Copy the supplied `jsconfig.json` into the script project. It supports either
`npm install ceenjs6` or a local `declarations` directory, selects ES2020
without browser DOM globals, and uses `skipLibCheck` for the generated
Android/Java declarations. The hand-maintained module bodies are checked
separately by the repository's tests.

JSOX extensions are opt-in. The supplied configuration excludes their files
from automatic local scanning. Explicitly reference an extension entry only
when the runtime script enables the same extension:

```typescript
/// <reference path="./declarations/ceenjs6/cj6-jsox-array-extensions.d.ts" />
jsox.extend('Array');
const unique = [1, 1, 2].distinct();
```

For an npm installation, the reference path starts with
`./node_modules/ceenjs6/declarations/ceenjs6/` instead. Referenced files are
loaded even when they match `exclude`. Enable each extension consistently
across all scripts sharing one TypeScript project, since global declaration
merging applies to that entire project.
