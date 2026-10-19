// Type definitions for CeenJs6 internal module shizuku
//
// Definitions by: SuperMonster003 <https://github.com/SuperMonster003>
// TypeScript Version: 5.1.3
//
// Last modified: Oct 15, 2026

/// <reference path="./index.d.ts" />

/**
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/augment/shizuku/Shizuku.kt
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/WrappedShizuku.kt
 * @Source %CeenJs6%/app/src/main/java/org/ceenjs/ceenjs/runtime/api/augment/shell/Shell.kt
 */

declare namespace Internal {

    import AbstractShell = org.ceenjs.ceenjs.runtime.api.AbstractShell;

    interface Shizuku extends Omit<org.ceenjs.ceenjs.runtime.api.WrappedShizuku, 'execCommand'> {

        readonly state: Shizuku.State;

        (command: Shell.Command): AbstractShell.Result;
        (command: Shell.Command, withRoot: boolean | number): AbstractShell.Result;
        (command: Shell.Command, commandArgument: Shell.CommandArguments): AbstractShell.Result;
        (command: Shell.Command, commandArgument: Shell.CommandArguments, withRoot: boolean | number): AbstractShell.Result;

        execCommand(command: Shell.Command): AbstractShell.Result;
        execCommand(command: Shell.Command, withRoot: boolean | number): AbstractShell.Result;
        execCommand(command: Shell.Command, commandArgument: Shell.CommandArguments): AbstractShell.Result;
        execCommand(command: Shell.Command, commandArgument: Shell.CommandArguments, withRoot: boolean | number): AbstractShell.Result;

        getCommand(command: Shell.Command): string;
        getCommand(command: Shell.Command, withRoot: boolean | number): string;
        getCommand(command: Shell.Command, commandArgument: Shell.CommandArguments): string;
        getCommand(command: Shell.Command, commandArgument: Shell.CommandArguments, withRoot: boolean | number): string;

        kill(app: org.ceenjs.ceenjs.util.App | string): boolean;

        currentPackage(): string;

        currentActivity(): string;

        currentComponent(): string;

    }

}

declare namespace Shizuku {

    interface State {
        isInstalled: boolean;
        hasService: boolean;
        isRunning: boolean;
        hasPermission: boolean;
        isOperational: boolean;
    }

}
