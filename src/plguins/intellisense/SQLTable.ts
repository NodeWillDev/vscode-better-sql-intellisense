import * as vscode from "vscode";
import { IPlugin } from "../IPlugin";

export class SQLTable implements IPlugin {
  private context: vscode.ExtensionContext;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
  }
  public async init(): Promise<void> {}
}
