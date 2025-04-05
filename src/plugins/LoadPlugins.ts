import * as vscode from "vscode";
import { SQLColor } from "./decorators/SQLColor";
import { Plugin } from "./Plugin";
import { SQLTable } from "./intellisense/SQLTable";
import { SQLInsertSnippet } from "./snippets/SQLInsertSnippet";
import { SQLSelectSnippet } from "./snippets/SQLSelectSnippet";
import { SQLUpdateSnippet } from "./snippets/SQLUpdateSnippet";
import { SQLCreateSnippet } from "./snippets/SQLCreateSnippet";

export class LoadPlugins {
  public static plugins: Plugin[] = [];

  public static async load(context: vscode.ExtensionContext): Promise<void> {
    LoadPlugins.plugins.push(await new SQLColor(context).init());
    LoadPlugins.plugins.push(await new SQLTable(context).init());
    LoadPlugins.plugins.push(await new SQLInsertSnippet(context).init());
    LoadPlugins.plugins.push(await new SQLSelectSnippet(context).init());
    LoadPlugins.plugins.push(await new SQLUpdateSnippet(context).init());
    LoadPlugins.plugins.push(await new SQLCreateSnippet(context).init());
  }
}
