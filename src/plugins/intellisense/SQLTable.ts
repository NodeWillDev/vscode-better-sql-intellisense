import * as vscode from "vscode";

import { Plugin } from "../Plugin";
import { TABLE } from "../../utils/Regex";
import {
  DescribeTablesData,
  LoadRemoteTables,
} from "../../load/remote/LoadRemoteTables";

export class SQLTable extends Plugin {
  //   private intellisense: vscode.Disposable;

  private tables: { [key: string]: DescribeTablesData }[] | null = null;

  constructor(main: vscode.ExtensionContext) {
    super(main);
    // this.intellisense = vscode.languages.registerCompletionItemProvider(
    //   {
    //     scheme: "file",
    //     language: "javascript",
    //   },
    //   {
    //     async provideCompletionItems(document, position, token, context) {
    //       if (TABLE.test(document.lineAt(position).text)) {
    //       }
    //       return [];
    //     },
    //   },
    //   " "
    // );
  }

  public async init(): Promise<SQLTable> {
    const remote = await new LoadRemoteTables().init({
      database: "ban",
      host: "localhost",
      password: "root",
      port: 3306,
      user: "root",
    });
    try {
      console.log(remote);
    } catch (error) {
      console.log(error);
    }
    // console.log(this.tables);
    // this.main.subscriptions.push(this.intellisense);
    return this;
  }
}
