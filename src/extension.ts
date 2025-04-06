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

  const intellisense = vscode.languages.registerCompletionItemProvider(
    {
      language: "javascript",
      scheme: "file",
    },
    {
      async provideCompletionItems(document, position, token, context) {
        if (
          /\b(?:FROM|JOIN|UPDATE|INTO|DELETE\s+FROM)\s+([a-zA-Z0-9_.]+)/gi.test(
            document.getText()
          )
        )
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
