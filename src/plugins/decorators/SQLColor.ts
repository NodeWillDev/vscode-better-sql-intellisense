import * as vscode from "vscode";
import { Plugin } from "../Plugin";
import { Regex } from "../../utils/Regex";

export class SQLColor extends Plugin {
  private decorator: vscode.TextEditorDecorationType;

  constructor(main: vscode.ExtensionContext) {
    super(main);
    this.decorator = vscode.window.createTextEditorDecorationType({
      color: "#569CD6",
    });
  }

  private updateColor(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let ranges: vscode.DecorationOptions[] = [];

    let match;
    while ((match = Regex.exec(editor.document.getText()))) {
      let start = editor.document.positionAt(match.index);
      let end = editor.document.positionAt(match.index + match[0].length);
      ranges.push({ range: new vscode.Range(start, end) });
    }

    editor.setDecorations(this.decorator, ranges);
  }

  public init(): SQLColor {
    this.main.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(this.updateColor)
    );
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document === vscode.window.activeTextEditor?.document) {
        this.updateColor();
      }
    });
    if (vscode.window.activeTextEditor) {
      this.updateColor();
    }
    return this;
  }
}
