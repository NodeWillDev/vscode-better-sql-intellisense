import * as vscode from "vscode";
import { Connection } from "mysql2/promise";
import { LoadPlugins } from "./plugins/LoadPlugins";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "sql-intellisense",
    async () => {
      LoadPlugins.load(context);
    }
  );

  const intellisense = vscode.languages.registerCompletionItemProvider(
    {
      language: "javascript",
      scheme: "file",
    },
    {
      async provideCompletionItems(document, position, token, context) {
        if (/\b(SELECT|FROM)\b/i.test(document.lineAt(position).text))
          console.log("find");
        else console.log("NOT FOUND");
        return [
          new vscode.CompletionItem("test", vscode.CompletionItemKind.Color),
        ];
      },
    },
    "."
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(intellisense);
}
export function deactivate() {}
