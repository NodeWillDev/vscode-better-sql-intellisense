import * as vscode from "vscode";
import { connection } from "./operator/mysql/connection";
import { loadedTables } from "./operator/mysql/loaded-tables";

export function activate(context: vscode.ExtensionContext) {
  console.log("Loadded extension");
  const disposable = vscode.commands.registerCommand(
    "sql-intellisense",
    async () => {
      await connection({
        database: vscode.workspace
          .getConfiguration("sql-intellisense")
          .get("database-remote-database") as string,
        host: vscode.workspace
          .getConfiguration("sql-intellisense")
          .get("database-remote-host") as string,
        password: vscode.workspace
          .getConfiguration("sql-intellisense")
          .get("database-remote-password") as string,
        port: vscode.workspace
          .getConfiguration("sql-intellisense")
          .get("database-remote-port") as number,
        user: vscode.workspace
          .getConfiguration("sql-intellisense")
          .get("database-remote-user") as string,
      });

      await loadedTables();
    }
  );
  context.subscriptions.push(disposable);
}
export function deactivate() {}
