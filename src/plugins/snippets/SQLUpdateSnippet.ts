import * as vscode from "vscode";
import { Plugin } from "../Plugin";

export class SQLUpdateSnippet extends Plugin {
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
              !/^U/.test(
                document.getText(document.getWordRangeAtPosition(position))
              )
            )
              return;
            const completion = new vscode.CompletionItem(
              "InsertSQL",
              vscode.CompletionItemKind.Snippet
            );

            completion.insertText = new vscode.SnippetString(
              "INSERT INTO ${1:table_name} (${2:columns}) VALUES(${3:values});$0"
            );

            completion.documentation = new vscode.MarkdownString(
              "Snippet to insert values into a table"
            );

            return [completion];
          },
        },
        "InsertSQL"
      )
    );
    return this;
  }
}
