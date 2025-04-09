import * as vscode from "vscode";
import { LoadRemoteDatabase } from "./load/remote/LoadRemoteDatabase";
import { Load } from "./load/Load";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "better-sql-intellisense",
    async () => {
      await new Load().init();
    }
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
