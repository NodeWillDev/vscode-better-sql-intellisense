import * as vscode from "vscode";
import { Connection } from "mysql2/promise";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "sql-intellisense",
    async () => {}
  );
  let decorationType = vscode.window.createTextEditorDecorationType({
    color: "#569CD6",
  });

  let updateDecorations = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const text = editor.document.getText();
    const regex =
      /(["'`])(?:SELECT|CREATE|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|ON|LIKE|GROUP BY|ORDER BY|LIMIT)[^"'`]*\1/gi;
    let ranges: vscode.DecorationOptions[] = [];

    let match;
    while ((match = regex.exec(text))) {
      let start = editor.document.positionAt(match.index);
      let end = editor.document.positionAt(match.index + match[0].length);
      ranges.push({ range: new vscode.Range(start, end) });
    }

    editor.setDecorations(decorationType, ranges);
  };

  let update = vscode.window.onDidChangeActiveTextEditor(updateDecorations);
  context.subscriptions.push(update);

  vscode.workspace.onDidChangeTextDocument((event) => {
    if (event.document === vscode.window.activeTextEditor?.document) {
      updateDecorations();
    }
  });

  if (vscode.window.activeTextEditor) {
    updateDecorations();
  }
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
