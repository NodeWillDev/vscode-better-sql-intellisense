import * as vscode from "vscode";

import { Plugin } from "../Plugin";
import { TABLE } from "../../utils/Regex";
import {
  DescribeTablesData,
  LoadRemoteTables,
} from "../../load/remote/LoadRemoteTables";

export class SQLTable extends Plugin {
  private intellisense!: vscode.Disposable;

  private tables: DescribeTablesData[] | null = null;

  constructor(main: vscode.ExtensionContext) {
    super(main);
  }

  public async init(): Promise<SQLTable> {
    const remote = await new LoadRemoteTables().init({
      database: "ban",
      host: "localhost",
      password: "root",
      port: 3306,
      user: "root",
    });
    this.tables =
      (await remote.getFieldsData()) as unknown as DescribeTablesData[];
    this.intellisense = vscode.languages.registerCompletionItemProvider(
      {
        scheme: "file",
        language: "javascript",
      },
      {
        provideCompletionItems: this.provideCompletionItems.bind(this),
      }
    );
    this.main.subscriptions.push(this.intellisense);
    return this;
  }

  private provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
    context: vscode.CompletionContext
  ) {
    const result: vscode.CompletionItem[] = [];
    if (
      TABLE.test(
        document.lineAt(position).text.substring(0, position.character)
      )
    ) {
      this.tables?.forEach((table) => {
        const completion = new vscode.CompletionItem(
          table["TABLE_NAME"],
          vscode.CompletionItemKind.Interface
        );
        const markdown = new vscode.MarkdownString("## COLUMNS\n\n");
        table.data.forEach((fields) => {
          markdown.appendMarkdown(
            `\`\`\`md\n` +
              `🔹 ${fields["COLUMN_NAME"]}\n` +
              `🟢 Type: ${fields["COLUMN_TYPE"]}\n` +
              `🟡 Default: ${fields["COLUMN_DEFAULT"] || "NULL"}\n` +
              `🔸 Accept Null: ${fields["IS_NULLABLE"]}\n` +
              (fields["COLUMN_KEY"]
                ? `🔑 Key: ${fields["COLUMN_KEY"]}\n`
                : "") +
              (fields["EXTRA"] ? `⚙️ Extra: ${fields["EXTRA"]}\n` : "") +
              `\`\`\`\n-----\n`
          );
        });
        completion.documentation = markdown;
        completion.detail = `Columns of table ${table[
          "TABLE_NAME"
        ].toUpperCase()}`;
        result.push(completion);
      });
    }
    return result;
  }
}
