import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  console.log("Loadded extension");
  const disposable = vscode.commands.registerCommand(
    "sql-intellisense",
    async () => {}
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
