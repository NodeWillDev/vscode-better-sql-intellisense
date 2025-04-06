import * as vscode from "vscode";
import { SQLColor } from "./decorators/SQLColor";
import { Plugin } from "./Plugin";
import { TableColor } from "./decorators/TableColor";
import { SQLTable } from "./intellisense/SQLTable";

export class LoadPlugins {
  public static plugins: Plugin[] = [];

  public static async load(context: vscode.ExtensionContext): Promise<void> {
    LoadPlugins.plugins.push(await new SQLColor(context).init());
    LoadPlugins.plugins.push(await new SQLTable(context).init());
    // LoadPlugins.plugins.push(new TableColor(context).init());
  }
}
