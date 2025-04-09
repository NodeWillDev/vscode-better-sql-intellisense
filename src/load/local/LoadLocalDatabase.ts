import * as vscode from "vscode";
import { DatabaseType, ILoad } from "../ILoad";
import * as sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs/promises";

export class LoadLocalDatabase implements ILoad {
  public data: Record<string, { name: string; data: DatabaseType[] }> = {};
  public async init(): Promise<void> {
    const config = vscode.workspace
      .getConfiguration("better-sql-intellisense")
      .get("database-local") as string[];
    config.forEach(async (database) => {
      try {
        if (!(await fs.stat(database)).isFile())
          throw new Error(`${database} not is a file`);
        const db = await open({
          filename: database,
          driver: sqlite3.Database,
        });
        (
          await (
            await db.prepare(
              "SELECT name FROM sqlite_master WHERE type = 'table' AND name != 'sqlite_sequence'"
            )
          ).all()
        ).forEach(async (data: { name: string }) => {
          this.data[`database-local-${data.name}`] = {
            name: db.config.filename,
            data: [],
          };
          this.data[`database-local-${data.name}`].data.push(
            ...(
              await (await db.prepare(`PRAGMA table_info(${data.name})`)).all()
            ).map(
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
                COLUMN_KEY: colum.pk === 1 ? "PRI" : "",
                COLUMN_DEFAULT: colum.dflt_value,
                EXTRA: "",
                COLUMN_COMMENT: "",
              })
            )
          );
        });
      } catch {
        vscode.window.showErrorMessage(
          `An error occurred while trying to get the local database: '${database}'.\nThe path provided may be incorrect or vscode does not have permission to access the given path:\nFix: Try running VSCode with administrator permission`
        );
      }
    });
  }
}
