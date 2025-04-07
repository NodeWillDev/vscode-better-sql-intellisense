import * as vscode from "vscode";

import { Plugin } from "../Plugin";
import { COLUMNS, TABLE } from "../../utils/Regex";
import {
  DescribeTablesData,
  LoadRemoteTables,
} from "../../load/remote/LoadRemoteTables";

export class SQLColumns extends Plugin {
  private intellisense!: vscode.Disposable;

  private table: DescribeTablesData[] | null = null;

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
    this.table = Object.values(await remote.getFieldsData());
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

  private reference: string = "";

  private provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    const result: vscode.CompletionItem[] = [];
    let match =
      /\bSELECT\b\s+(.*?)\s+\bFROM\b\s+[`"'`]?(?<table>\w+)[`"'`]?(?=\s|$)/gim.exec(
        document.lineAt(position).text
      );
    if (match?.groups?.["table"]) this.reference = match?.groups?.["table"];
    if (
      this.reference &&
      /\bSELECT\b(?![\s\S]*\bFROM\b)/i.test(
        document.lineAt(position).text.substring(0, position.character)
      )
    ) {
      this.table
        ?.find((table) => table.TABLE_NAME === this.reference)
        ?.data.forEach((data) => {
          result.push(
            new vscode.CompletionItem(
              data["COLUMN_NAME"],
              vscode.CompletionItemKind.Variable
            )
          );
        });
    }

    return result;
  }
}
