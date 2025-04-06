import * as vscode from "vscode";
import { SQLColor } from "./decorators/SQLColor";
import { Plugin } from "./Plugin";

export class LoadPlugins {
  public static plugins: Plugin[] = [];

  public static load(context: vscode.ExtensionContext): void {
    LoadPlugins.plugins.push(new SQLColor(context).init());
  }
}
