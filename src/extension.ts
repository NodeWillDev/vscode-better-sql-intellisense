import * as vscode from "vscode";
import { LoadPlugins } from "./plugins/LoadPlugins";
import { LoadRemoteTables } from "./load/remote/LoadRemoteTables";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "sql-intellisense",
    async () => {
      await LoadPlugins.load(context);
    }
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
