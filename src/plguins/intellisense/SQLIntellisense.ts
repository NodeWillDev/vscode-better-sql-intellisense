import * as vscode from "vscode";
import { IPlugin } from "../IPlugin";
import { load } from "../../extension";

export class SQLIntellisense implements IPlugin {
  private context: vscode.ExtensionContext;

  private intellisense: vscode.Disposable;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.intellisense = vscode.languages.registerCompletionItemProvider(
      {
        language: "javascript",
        scheme: "file",
      },
      {
        provideCompletionItems: this.handleIntellisense,
      }
    );
  }
  public async init(): Promise<void> {}

  private handleIntellisense(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ): vscode.ProviderResult<vscode.CompletionItem[]> {
    console.log(
      document
        .lineAt(
          vscode.window.activeTextEditor?.selection.active as vscode.Position
        )
        .text.substring(0, position.character)
    );
    const completion: vscode.CompletionItem[] = [];
    if (
      /(["'])(?:(?!\1)[\s\S])*?\b(FROM|UPDATE|INSERT(?:\s+INTO)?)\b\s+\w*(\s*)?/gim.exec(
        document
          .lineAt(
            vscode.window.activeTextEditor?.selection.active as vscode.Position
          )
          .text.substring(0, position.character)
      )
    ) {
      Object.keys(load.data).forEach((key) => {
        const intellisense = new vscode.CompletionItem(
          key.replace(/database-(remote|local)-/g, ""),
          /database-local-/g.test(key)
            ? vscode.CompletionItemKind.File
            : vscode.CompletionItemKind.Struct
        );
        intellisense.detail = /database-local-/g.test(key)
          ? `Local file: ${load.data[key].name}`
          : `Remote database: ${load.data[key].name}`;

        intellisense.documentation = new vscode.MarkdownString(`
### ${load.data[key].name.toUpperCase()}

**Columns:**
${load.data[key].data
  .map(
    (column) => `
- **${column.COLUMN_NAME}**  
  ▸ Type: \`${column.COLUMN_TYPE}\`  
  ▸ Nullable: ${column.IS_NULLABLE === "YES" ? "✅" : "❌"}  
  ▸ Key: ${column.COLUMN_KEY || "None"}  
  ▸ Default: \`${column.COLUMN_DEFAULT || "NULL"}\`  
  ▸ Extra: ${column.EXTRA || "None"}  
  ▸ Comment: ${column.COLUMN_COMMENT || "None"}  
`
  )
  .join("")}
    `);
        completion.push(intellisense);
      });
    }
    return completion;
  }
}
