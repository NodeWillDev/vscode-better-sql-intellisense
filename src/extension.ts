import * as vscode from "vscode";
import { Connection } from "mysql2/promise";

export function activate(context: vscode.ExtensionContext) {
  let tables: any = [];
  const disposable = vscode.commands.registerCommand(
    "sql-intellisense",
    async () => {}
  );
  const intellisense = vscode.languages.registerCompletionItemProvider(
    {
      language: "javascript",
      scheme: "file",
    },
    {
      async provideCompletionItems(document, position, token, context) {
        return [
          new vscode.CompletionItem("log", vscode.CompletionItemKind.File),
        ];
      },
    },
    "."
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(intellisense);
}
export function deactivate() {}
