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
  let test = vscode.languages.registerCompletionItemProvider(
    {
      scheme: "file",
      language: "javascript",
    },
    {
      provideCompletionItems(document, position) {
        const line = document.lineAt(position).text;
        const textUntilCursor = line.substring(0, position.character);

        if (/from\s*$/i.test(textUntilCursor)) {
          console.log("Right now digit 'from' (with or out whitespace)");
        }

        return [];
      },
    },
    "."
  );
  context.subscriptions.push(disposable);
  context.subscriptions.push(test);
}
export function deactivate() {}
