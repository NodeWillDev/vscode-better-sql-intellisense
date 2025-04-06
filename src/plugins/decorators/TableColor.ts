import * as vscode from "vscode";
import { Plugin } from "../Plugin";
import { SQL, TABLE } from "../../utils/Regex";

export class TableColor extends Plugin {
  private decorator: vscode.TextEditorDecorationType;

  constructor(main: vscode.ExtensionContext) {
    super(main);
    this.decorator = vscode.window.createTextEditorDecorationType({
      color: "#662fab",
    });
  }

  private updateColor(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    let ranges: vscode.DecorationOptions[] = [];

    let match;
    console.log(
      /(["'`])(?:[^"'`\\]|\\.)*?\b(SELECT|CREATE|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|ON|LIKE|GROUP BY|ORDER BY|LIMIT)\b(?:[^"'`\\]|\\.)*?\1|\b(?:FROM|JOIN|INTO|UPDATE|TABLE)\s+[`"'`]?([a-zA-Z0-9_]+)[`"'`]?\b/gi.exec(
        editor.document.getText()
      )
    );
    while ((match = TABLE.exec(editor.document.getText()))) {
      if (!match[1]) continue;

      const start = editor.document.positionAt(
        match.index + match[0].indexOf(match[1])
      );
      const end = editor.document.positionAt(
        match.index + match[0].indexOf(match[1]) + match[1].length
      );

      ranges.push({ range: new vscode.Range(start, end) });
    }

    editor.setDecorations(this.decorator, ranges);
  }

  public async init(): Promise<TableColor> {
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
