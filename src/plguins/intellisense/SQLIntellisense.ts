import * as vscode from "vscode";
import { IPlugin } from "../IPlugin";
import { load } from "../../extension";

export class SQLIntellisense implements IPlugin {
  private context: vscode.ExtensionContext;

  private intellisense: vscode.Disposable;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.intellisense = vscode.languages.registerCompletionItemProvider(
      {
        language: "javascript",
        scheme: "file",
      },
      {
        provideCompletionItems: this.handleIntellisense,
      }
    );
  }
  public async init(): Promise<void> {}

  private handleIntellisense(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    console.log(
      document
        .lineAt(
          vscode.window.activeTextEditor?.selection.active as vscode.Position
        )
        .text.substring(0, position.character)
    );
    const completion: vscode.CompletionItem[] = [];
    if (
      /(["'])(?:(?!\1)[\s\S])*?\b(FROM|UPDATE|INSERT(?:\s+INTO)?)\b\s+\w*(\s*)?/gim.exec(
        document
          .lineAt(
            vscode.window.activeTextEditor?.selection.active as vscode.Position
          )
          .text.substring(0, position.character)
      )
    ) {
      Object.keys(load.data).forEach((key) => {
        completion.push(
          new vscode.CompletionItem(
            key.includes("database-local")
              ? `Database Local: ${key.replace("database-local-", "")}`
              : `Database Remote: ${key.replace("database-remote-", "")}`
          )
        );
      });
    }
    return [];
  }
}
