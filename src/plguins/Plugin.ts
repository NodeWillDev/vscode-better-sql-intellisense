import * as vscode from "vscode";
import { SQLColor } from "./decorators/SQLColor";
import { IPlugin } from "./IPlugin";
import { SQLIntellisense } from "./intellisense/SQLIntellisense";

export class Plugin {
  protected plugins: IPlugin[] = [];

  public async init(context: vscode.ExtensionContext): Promise<void> {
    this.plugins.push(new SQLColor(context));
    this.plugins.push(new SQLIntellisense(context));
    for (const plugin of this.plugins) await plugin.init();
  }
}
