import * as vscode from "vscode";
import { DatabaseType, ILoad } from "../ILoad";
import * as sqlite from "sqlite3";
import { table } from "console";

export class LoadLocalDatabase implements ILoad {
  public data: Record<string, { name: string; data: DatabaseType[] }> = {};
  public async init(): Promise<void> {
    const config = vscode.workspace
      .getConfiguration("better-sql-intellisense")
      .get("database-local") as string[];
    config.forEach((table) => {
      console.log(sqlite.cached.Database(table).exec("SHOW TABLES;"));
    });
  }
}
