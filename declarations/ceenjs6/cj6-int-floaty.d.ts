// Type definitions for CeenJs6 internal module floaty
//
// Definitions by: SuperMonster003 <https://github.com/SuperMonster003>
// TypeScript Version: 5.1.3
//
// Last modified: Oct 15, 2026

/// <reference path="./index.d.ts" />

/**
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/augment/floaty/Floaty.kt
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/Floaty.kt
 */

declare namespace Internal {

    interface Floaty {

        /**
         * @example
         * let w = floaty.window(
         *     <frame>
         *         <text textSize="50" bg="@android:color/gray">悬浮文字</text>
         *     </frame>
         * );
         * setTimeout(w.close.bind(w), 1.5e3);
         */
        window(layout: string | XML): org.ceenjs.ceenjs.runtime.api.Floaty.JsResizableWindow;


        /**
         * @example
         * let w = floaty.rawWindow(
         *     <frame>
         *         <text gravity="center" textSize="50" text="悬浮文字"
         *               bg="@android:color/darkgray" color="@android:color/white"
         *         />
         *     </frame>
         * );
         * w.setSize(-1, -1);
         * setTimeout(w.close.bind(w), 1.5e3);
         */
        rawWindow(layout: string | XML): org.ceenjs.ceenjs.runtime.api.Floaty.JsRawWindow;


        hasPermission(): boolean;

        checkPermission(): boolean;

        requestPermission(): void;

        ensurePermission(): void;

        closeAll(): void;

        getClip(maxDelayAfterWindowReady?: number): string;

    }

}
