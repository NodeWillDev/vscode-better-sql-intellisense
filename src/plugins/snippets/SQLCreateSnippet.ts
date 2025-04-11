import * as vscode from "vscode";
import { Plugin } from "../Plugin";

export class SQLCreateSnippet extends Plugin {
  constructor(main: vscode.ExtensionContext) {
    super(main);
  }

  public async init(): Promise<Plugin> {
    this.main.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        {
          scheme: "file",
          language: "javascript",
        },
        {
          provideCompletionItems(document, position) {
            if (
              !/^C/.test(
                document.getText(document.getWordRangeAtPosition(position))
              )
            )
              return;
            const completion = new vscode.CompletionItem(
              "CreateSQL",
              vscode.CompletionItemKind.Snippet
            );

            completion.insertText = new vscode.SnippetString(
              "CREATE TABLE ${1:table_name} (\n" +
                "  id INTEGER PRIMARY KEY AUTOINCREMENT,\n" +
                "  ${2:column_name} ${3:type}\n" +
                ");$0"
            );

            completion.documentation = new vscode.MarkdownString(
              "Snippet to create tables"
            );

            return [completion];
          },
        },
        "CreateSQL"
      )
    );
    return this;
  }
}
