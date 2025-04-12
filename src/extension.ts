import * as vscode from "vscode";
import { LoadRemoteDatabase } from "./load/LoadRemoteDatabase";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "better-sql-intellisense",
    async () => {
      await new LoadRemoteDatabase().init();
      // console.log(LoadRemoteDatabase.data);
    }
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
