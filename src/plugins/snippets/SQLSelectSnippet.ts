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
            // Se não começar com 'S', não retorna nada
            if (
              !/^S/.test(
                document.getText(document.getWordRangeAtPosition(position))
              )
            )
              return;

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
            completion.filterText = "SelectSQL";

            return [completion];
          },
        }
      )
    );
    return this;
  }
}
