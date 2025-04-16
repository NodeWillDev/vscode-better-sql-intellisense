import * as vscode from "vscode";
import { IPlugin } from "../IPlugin";

export class SQLColor implements IPlugin {
  private context: vscode.ExtensionContext;
  private decorator: vscode.TextEditorDecorationType;
  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.decorator = vscode.window.createTextEditorDecorationType({
      color: "#ffcccc",
    });
  }

  public async init(): Promise<void> {
    this.context.subscriptions.push(
      vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;
        const ranges: vscode.Range[] = [];
        for (const match of editor.document
          .getText()
          .matchAll(
            /(["'])(?:(?!\1).)*?\b(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|WITH|REPLACE|TRUNCATE)\b[\s\S]*?\1/gim
          )) {
          ranges.push(
            new vscode.Range(
              editor.document.positionAt(match.index),
              editor.document.positionAt(match[0].length + match.index)
            )
          );
          editor.setDecorations(this.decorator, ranges);
        }
      })
    );
  }
}
