import mysql from "mysql2/promise";
import { Connection } from "mysql2/promise";
import { Load } from "../Load";

export interface DescribeTablesData {
  data: {
    COLUMN_NAME: string;
    COLUMN_TYPE: string;
    IS_NULLABLE: "YES" | "NO";
    COLUMN_KEY: string | null;
    COLUMN_DEFAULT: string | null;
    EXTRA: string | null;
    COLUMN_COMMENT: string | null;
  }[];
  TABLE_NAME: string;
}

export class LoadRemoteTables extends Load {
  protected connection!: Connection;

  public async init(data: {
    database: string;
    user: string;
    host: string;
    password: string;
    port: number;
  }): Promise<LoadRemoteTables> {
    try {
      this.connection = await mysql.createConnection({
        database: data.database,
        password: data.password,
        user: data.user,
        port: data.port,
        host: data.host,
      });
    } catch (error) {
      console.error("Failed to establish connection:", error);
    }
    return this;
  }

  public async getTables(): Promise<string[]> {
    console.log(this.connection);
    return (
      (await this.connection.query("SHOW TABLES"))[0] as Array<{
        [key: string]: string;
      }>
    ).map((row: { [key: string]: string }) => Object.values(row)[0]);
  }

  public async getFieldsData(): Promise<
    Array<{ TABLE_NAME: string; data: DescribeTablesData["data"] }>
  > {
    const result: Array<{
      TABLE_NAME: string;
      data: DescribeTablesData["data"];
    }> = [];
    for (const table of await this.getTables()) {
      const data = (
        await this.connection.query(
          `SELECT 
            COLUMN_NAME,
            COLUMN_TYPE,
            IS_NULLABLE,
            COLUMN_KEY,
              CASE COLUMN_KEY 
                WHEN 'PRI' THEN 'PRIMARY KEY'
                WHEN 'UNI' THEN 'UNIQUE'
                WHEN 'MUL' THEN 'FOREIGN KEY'              
            END AS COLUMN_KEY,
          COLUMN_DEFAULT,
          EXTRA,
          COLUMN_COMMENT
          FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = '${table}' 
            AND TABLE_SCHEMA = '${this.connection.config.database}';`
        )
      )["0"] as DescribeTablesData["data"];
      result.push({ TABLE_NAME: table, data });
    }
    return result;
  }
}
