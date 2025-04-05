import * as vscode from "vscode";
import { Plugin } from "../Plugin";

export class SQLInsertSnippet extends Plugin {
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
              "UpdateSQL",
              vscode.CompletionItemKind.Snippet
            );

            completion.insertText = new vscode.SnippetString(
              "UPDATE ${1:table_name} SET ${2:column} = ${3:value} WHERE ${4:condition};$0"
            );

            completion.documentation = new vscode.MarkdownString(
              "Snippet to update a table"
            );

            return [completion];
          },
        },
        "UpdateSQL"
      )
    );
    return this;
  }
}
