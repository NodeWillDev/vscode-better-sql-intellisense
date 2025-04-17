import * as vscode from "vscode";
import { Load } from "./load/Load";
import { Plugin } from "./plguins/Plugin";

export const load = new Load();
export const plugin = new Plugin();

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "better-sql-intellisense",
    async () => {
      await load.init();
      await plugin.init(context);
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
