import * as vscode from "vscode";
import { SQLColor } from "./decorators/SQLColor";

export abstract class Plugin {
  public main: vscode.ExtensionContext;

  constructor(main: vscode.ExtensionContext) {
    this.main = main;
  }

  public abstract init(): Promise<Plugin>;
}
