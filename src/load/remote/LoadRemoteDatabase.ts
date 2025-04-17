import * as vscode from "vscode";
import * as mysql from "mysql2/promise";
import { Load } from "../Load";
import { DatabaseType, ILoad, LoadDataType } from "../ILoad";

export class LoadRemoteDatabase implements ILoad {
  public data: LoadDataType = {};

  public async init(): Promise<void> {
    const config = vscode.workspace.getConfiguration("better-sql-intellisense");
    if (!config.get("database-remote")) {
      vscode.window.showWarningMessage(
        "The 'best-sql-intellisense.database-remote' extension is currently disabled, making any queries to the remote database impossible."
      );
      return;
    }
    try {
      const connection = await mysql.createConnection({
        user: config.get("database-remote-user") as string,
        password: config.get("database-remote-password") as string,
        host: config.get("database-remote-host") as string,
        port: config.get("database-remote-port") as number,
        database: config.get("database-remote-database") as string,
      });
      Object.values(
        (await connection.query("SHOW TABLES;")).slice(0, 1)[0]
      ).forEach(async (table) => {
        this.data[`database-remote-${Object.values(table)[0] as string}`] = {
          name: Object.values(table)[0] as string,
          data: [],
        };
        (
          (
            await connection.query(
              `SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE,  
            CASE 
                WHEN COLUMN_KEY = 'PRI' THEN 'PRIMARY KEY'
                WHEN COLUMN_KEY = 'UNI' THEN 'UNIQUE'
                WHEN COLUMN_KEY = 'MUL' THEN 'INDEX'
                ELSE COLUMN_KEY
            END AS COLUMN_KEY,
            COLUMN_DEFAULT, EXTRA, COLUMN_COMMENT FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${
              Object.values(table)[0]
            }' AND TABLE_SCHEMA = '${connection.config.database}';`
            )
          )[0] as DatabaseType[]
        ).forEach((data) => {
          this.data[
            `database-remote-${Object.values(table)[0] as string}`
          ].data.push({
            COLUMN_NAME: data.COLUMN_NAME,
            COLUMN_TYPE: data.COLUMN_TYPE,
            COLUMN_COMMENT: data.COLUMN_COMMENT,
            COLUMN_DEFAULT: data.COLUMN_DEFAULT,
            COLUMN_KEY: data.COLUMN_KEY,
            EXTRA: data.EXTRA,
            IS_NULLABLE: data.IS_NULLABLE,
          });
        });
      });
    } catch {
      vscode.window.showErrorMessage("Could not connect to your database");
    }
  }
}
