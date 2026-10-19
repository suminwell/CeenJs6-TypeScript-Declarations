/// <reference path="../../declarations/ceenjs6/index.d.ts" />

// Compile only. No Android calls are executed.
const hostName: string = ceenjs.name;
const hostPackage: string = $ceenjs.packageName;
const hostModule: Internal.Ceenjs = app.ceenjs;
const hostVersion: Internal.CeenjsVersion = ceenjs.version;
const hostResources: typeof org.ceenjs.ceenjs6.R = R;
const hostRuntimeClass: typeof org.ceenjs.ceenjs.runtime.ScriptRuntime = ScriptRuntime;
const rootMode: org.ceenjs.ceenjs.util.RootUtils.RootMode = ceenjs.getRootMode();
type CeenjsIsAny<T> = 0 extends 1 & T ? true : false;
const hostMustBeTyped: CeenjsIsAny<typeof ceenjs> = false;
const javaRuntimeMustBeTyped: CeenjsIsAny<typeof hostRuntimeClass> = false;
// @ts-expect-error The old runtime global does not exist in CeenJs6.
autojs.versionName;
// @ts-expect-error The old dollar-prefixed global does not exist in CeenJs6.
$autojs.versionName;
// @ts-expect-error The app exposes the renamed host module.
app.autojs;
// @ts-expect-error The old Java namespace must not survive the migration.
type OldRuntime = org.autojs.autojs.runtime.ScriptRuntime;
// @ts-expect-error The renamed host type must not degrade to any.
ceenjs.thisMethodDoesNotExist();
