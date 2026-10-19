// Type definitions for CeenJs6 internal module powerManager
//
// Definitions by: SuperMonster003 <https://github.com/SuperMonster003>
// TypeScript Version: 5.1.3
//
// Last modified: Jul 27, 2026

/// <reference path="./index.d.ts" />

/**
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/augment/power/PowerManager.kt
 */

declare namespace Internal {

    interface PowerManager {

        isIgnoringBatteryOptimizations(packageName?: string | null): boolean;

        requestIgnoreBatteryOptimizations(forceRequest?: boolean, packageName?: string | null): void;

    }

}
