import * as vscode from "vscode";
import { Plugin } from "../Plugin";

export class SQLSelectSnippet extends Plugin {
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
            const completion = new vscode.CompletionItem(
              "SelectSQL",
              vscode.CompletionItemKind.Snippet
            );

            completion.insertText = new vscode.SnippetString(
              "SELECT ${2:columns} FROM ${1:table_name} WHERE id=${3:compare};$0"
            );

            completion.documentation = new vscode.MarkdownString(
              "Snippet to make a query on the table"
            );

            return [completion];
          },
        },
        "SelectSQL"
      )
    );
    return this;
  }
}
