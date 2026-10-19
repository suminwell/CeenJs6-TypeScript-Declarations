// Type definitions for CeenJs6 internal module ceenjs
//
// Definitions by: SuperMonster003 <https://github.com/SuperMonster003>
// TypeScript Version: 4.5.4
//
// Last modified: Jul 27, 2026

/// <reference path="./index.d.ts" />

/**
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/augment/ceenjs/Ceenjs.kt
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/augment/ceenjs/Version.kt
 */

declare namespace Internal {

    interface Ceenjs extends CeenJsBridge, org.ceenjs.ceenjs.runtime.api.Events {

        /**
         * @example
         * ceenjs.versionCode; // e.g. 523
         */
        versionCode: number;

        /**
         * @example
         * ceenjs.versionName; // e.g. '6.0.2'
         */
        versionName: string;

        /**
         * @example
         * ceenjs.versionDate; // e.g. 'May 23, 2011'
         */
        versionDate: string;

        /**
         * @example
         * ceenjs.name; // e.g. 'CeenJs6'
         */
        name: string;

        packageName: string;

        readonly R: typeof org.ceenjs.ceenjs6.R;

        readonly rotation: number;

        readonly orientation: number;

        version: CeenjsVersion;

        /**
         * @example
         * // 1 or true or 'root' (force set root mode)
         * // 0 or false or 'non-root' (force set non-root mode)
         * // -1 or 'auto' (auto detect)
         * ceenjs.setRootMode('non-root');
         * console.log(ceenjs.getRootMode()); // non-root mode information
         * console.log(ceenjs.isRootAvailable()); // false (even if device has root access)
         */
        setRootMode(mode: -1 | 0 | 1 | boolean | 'auto' | 'root' | 'non-root', isWriteIntoPreference?: boolean | 'write_into_pref'): void;

        isScreenPortrait(): boolean;

        isScreenLandscape(): boolean;

        getRootMode(): org.ceenjs.ceenjs.util.RootUtils.RootMode;

        isRootAvailable(): boolean;

        canModifySystemSettings(): boolean;

        canWriteSecureSettings(): boolean;

        canDisplayOverOtherApps(): boolean;

        getLanguage(): java.util.Locale;

        getLanguageTag(): string;

        restart(scriptsAfterRestart?: string | string[]): void;

        exit(scriptsAfterRestart?: string | string[]): void;

        readonly themeColor: org.ceenjs.ceenjs.theme.ThemeColor;

    }

    interface CeenjsVersion {

        /**
         * @example
         * ceenjs.version.code; // e.g. 523
         */
        code: number;

        /**
         * @example
         * ceenjs.version.code; // e.g. '6.0.2'
         */
        name: string;

        /**
         * @example
         * ceenjs.version.date; // e.g. 'May 23, 2011'
         */
        date: string;

        /**
         * @example
         * ceenjs.version.name; // e.g. "6.2.0"
         * ceenjs.version.isHigherThan(6); // e.g. true
         * ceenjs.version.isHigherThan(7); // e.g. false
         * ceenjs.version.isHigherThan('4.1.0'); // e.g. true
         * ceenjs.version.isHigherThan('4.1.1 alpha'); // e.g. true
         * ceenjs.version.isHigherThan('6.2.0 alpha2'); // e.g. true
         * ceenjs.version.isHigherThan('8.9.6 beta'); // e.g. false
         */
        isHigherThan(otherVersion: string | number | Version): boolean;

        isLowerThan(otherVersion: string | number | Version): boolean;

        isEqual(otherVersion: string | number | Version): boolean;

        isAtLeast(otherVersion: string | number | Version, ignoreSuffix?: boolean): boolean;

    }

    interface CeenJsBridge {

        requestHandlers: {};

        onEventInternal(event: any, args: any): void;

        send(event: any, ...args: any[]): void;

        invoke(channel: any, ...args: any[]): Promise<unknown>;

        handle(channel: any, handler: any): this;

        removeHandler(channel: any): void;

        handleRequest(request: any): void;

        sendResponse(request: any, result: any, error: any): void;

    }

}
