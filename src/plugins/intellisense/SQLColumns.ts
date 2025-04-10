import * as vscode from "vscode";

import { Plugin } from "../Plugin";
import { TABLE } from "../../utils/Regex";
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

    let match: RegExpExecArray | null;
    if (
      (match =
        /\b(?:FROM|UPDATE|INTO|DELETE\s+FROM|TRUNCATE|REPLACE|MERGE\s+INTO)\s+[`"'`]?(?<table>\w+)[`"'`]?/.exec(
          document.lineAt(position).text.substring(0, position.character)
        )) &&
      match?.groups?.["table"]
    )
      this.reference = match?.groups?.["table"];
    if (
      (match =
        /(?:"'?\s*\bSELECT\b\s*(?!.*\b(FROM|WHERE|VALUES|RETURNING|GROUP|ORDER|HAVING)\b)(?<columns>[\w\s,.*]*)\s*["']?$)|(?:"'?\s*\bUPDATE\b\s+\w+\s+\bSET\b\s+(?!.*\b(WHERE|RETURNING|FROM|GROUP|ORDER|HAVING|JOIN)\b)(?<columns>[^;]+)\s*["']?$)|(?:"'?\s*\bINSERT\s+INTO\b\s+\w+\s*\((?!.*\))(?!.*\b(VALUES|RETURNING)\b)(?<columns>[^)]*)\)?\s*["']?$)/gim.exec(
          document.lineAt(position).text.substring(0, position.character)
        )) &&
      match?.groups?.["columns"]
    ) {
      const data = Array.from(
        (match?.groups?.["columns"] ?? "").matchAll(
          /(?:^|,\s*)([^=,\s]+)(?=\s*(?:=|,|$))/gim
        )
      ).map((colum) => colum[1].trim());

      console.log(data);
    }

    return result;
  }
}

/**
Eu posso ter a entrada de dois tipos:
1- 'name, email, password' 
2- 'name = "...", email = "..."'
preciso que o split separe esses campos pegando apenas as colunas, por exemplo. 
se for com update eles são sperados por = eu quero pegar apenas os valores da esquerda, se for um select eles são separados por , 
entendeu?
 */
