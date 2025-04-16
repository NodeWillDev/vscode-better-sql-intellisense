import * as vscode from "vscode";
import { Load } from "./load/Load";
import { Plugin } from "./plguins/Plugin";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "better-sql-intellisense",
    async () => {
      await new Load().init();
      await new Plugin().init(context);
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
