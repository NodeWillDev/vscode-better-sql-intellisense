import * as vscode from "vscode";

import { Plugin } from "../Plugin";

import {
  DescribeTablesData,
  LoadRemoteTables,
} from "../../load/remote/LoadRemoteTables";

export class SQLColumns extends Plugin {
  private intellisense!: vscode.Disposable;

  private table: DescribeTablesData[] = [];

  constructor(main: vscode.ExtensionContext) {
    super(main);
  }

  public async init(): Promise<SQLColumns> {
    const config = vscode.workspace.getConfiguration("sql-intellisense");
    if (!config.get("database-remote"))
      throw new Error("Intellisense with database remote not enable");
    const remote = await new LoadRemoteTables().init({
      database: config.get("database-remote-database") as string,
      host: config.get("database-remote-host") as string,
      password: config.get("database-remote-password") as string,
      port: config.get("database-remote-port") as number,
      user: config.get("database-remote-user") as string,
    });
    this.table = Object.values(await remote.getFieldsData());
    this.intellisense = vscode.languages.registerCompletionItemProvider(
      {
        scheme: "file",
        language: "javascript",
      },
      {
        provideCompletionItems: this.provideCompletionItems.bind(this),
      },
      ""
    );
    this.main.subscriptions.push(this.intellisense);
    // if (vscode.window.activeTextEditor) {
    //   this.updateTableReference();
    // }
    return this;
  }

  private provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    console.log(position);
    const result: vscode.CompletionItem[] = [];

    let match: RegExpExecArray | null;
    if (
      (match =
        /(?:"'?\s*\bSELECT\b\s*(?!.*\b(FROM|WHERE|VALUES|RETURNING|GROUP|ORDER|HAVING)\b)(?<columns>[\w\s,.*]*)\s*["']?$)|(?:"'?\s*\bUPDATE\b\s+\w+\s+\bSET\b\s+(?!.*\b(WHERE|RETURNING|FROM|GROUP|ORDER|HAVING|JOIN)\b)(?<columns>[\w\s,.*]*)\s*["']?$)|(?:"'?\s*\bINSERT\s+INTO\b\s+\w+\s*\((?!.*\))(?!.*\b(VALUES|RETURNING)\b)(?<columns>[^)]*)\)?\s*["']?$)/gim.exec(
          document.lineAt(position).text.substring(0, position.character)
        ))
    ) {
      const data = this.table
        .find((table) => table.TABLE_NAME == this.reference)
        ?.data.filter(
          (column) =>
            ![
              ...(match?.groups?.["columns"]?.matchAll(
                /(?:^|,\s*)([^=,\s]+)(?=\s*(?:=|,|$))/gim
              ) || []),
            ]
              .map(([_, name]) => name.trim().toLowerCase())
              .includes(column.COLUMN_NAME.toLowerCase())
        );
      data?.forEach((colum) => {
        const intellisense = new vscode.CompletionItem(
          colum.COLUMN_NAME,
          vscode.CompletionItemKind.Property
        );
        result.push(intellisense);
      });
    }

    return result;
  }

  private reference: string = "";

  private updateTableReference(position: vscode.Position): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let match;
    const lineText = editor.document
      .lineAt(position.line)
      .text.substring(0, position.character);
    if (
      (match =
        /\b(?:FROM|UPDATE|INTO|DELETE\s+FROM|TRUNCATE|REPLACE|MERGE\s+INTO)\s+[`"'`]?(?<table>\w+)[`"'`]?/.exec(
          lineText
        )) &&
      match?.groups?.["table"]
    ) {
      this.reference = match.groups["table"];
    }
  }
}
