import * as vscode from "vscode";

import { Plugin } from "../Plugin";
import { COLUMNS, TABLE } from "../../utils/Regex";
import {
  DescribeTablesData,
  LoadRemoteTables,
} from "../../load/remote/LoadRemoteTables";

export class SQLColumns extends Plugin {
  private intellisense!: vscode.Disposable;

  private table: string = "";

  constructor(main: vscode.ExtensionContext) {
    super(main);
  }

  public async init(): Promise<SQLColumns> {
    const remote = await new LoadRemoteTables().init({
      database: "ban",
      host: "localhost",
      password: "root",
      port: 3306,
      user: "root",
    });
    this.intellisense = vscode.languages.registerCompletionItemProvider(
      {
        scheme: "file",
        language: "javascript",
      },
      {
        provideCompletionItems: this.provideCompletionItems.bind(this),
      }
    );
    this.main.subscriptions.push(this.intellisense);
    return this;
  }

  private provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    const result: vscode.CompletionItem[] = [];
    console.log(
      document.lineAt(position).text.substring(0, position.character)
    );
    if (
      TABLE.test(
        document.lineAt(position).text.substring(0, position.character)
      )
    ) {
    }
    return result;
  }
}
