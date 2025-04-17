import * as vscode from "vscode";
import { ILoad, LoadDataType } from "../ILoad";
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import { stat } from "fs/promises";

export class LoadLocalDatabase implements ILoad {
  public data: LoadDataType = {};

  public async init(): Promise<void> {
    console.log("init");
    const config = vscode.workspace
      .getConfiguration("better-sql-intellisense")
      .get("database-local") as string[];
    for (const database of config) {
      try {
        if (!(await stat(database)).isFile())
          throw new Error(`${database} not is a file`);
        const db = await open({
          filename: database,
          driver: sqlite3.Database,
        });
        for (const data of await db.all(
          "SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence'"
        )) {
          this.data[`database-local-${data.name}`] = {
            name: db.config.filename,
            data: [],
          };
          this.data[`database-local-${data.name}`].data.push(
            ...(await db.all(`PRAGMA table_info(${data.name})`)).map(
              (colum: {
                name: string;
                type: string;
                notnull: number;
                pk: number;
                dflt_value: null | string;
              }) => ({
                COLUMN_NAME: colum.name,
                COLUMN_TYPE: colum.type,
                IS_NULLABLE: colum.notnull === 0 ? "YES" : "NO",
                COLUMN_KEY: colum.pk === 1 ? "PRIMARY KEY" : "",
                COLUMN_DEFAULT: colum.dflt_value,
                EXTRA: "",
                COLUMN_COMMENT: "",
              })
            )
          );
        }
        console.log(this.data);
      } catch {
        vscode.window.showErrorMessage(
          `An error occurred while trying to get the local database: '${database}'.\nThe path provided may be incorrect or vscode does not have permission to access the given path:\nFix: Try running VSCode with administrator permission`
        );
      }
    }
    // console.log(this.data["database-local-calendar"]);
  }
}
