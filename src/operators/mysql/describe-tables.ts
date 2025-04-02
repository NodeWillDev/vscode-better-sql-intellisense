import { Connection } from "mysql2/promise";
import { getConnection } from "./get-connection";
import { loadedAllTables } from "./loaded-all-tables";

interface DescribeTablesData {
  data: {
    COLUMN_NAME: string;
    COLUMN_TYPE: string;
    IS_NULLABLE: "YES" | "NO";
    COLUMN_KEY: string | null;
    COLUMN_DEFAULT: string | null;
    EXTRA: string | null;
    COLUMN_COMMENT: string | null;
  }[];
  TABLE_NAME: string | null;
}

export const describeTables = async (
  connection: Connection,
  tables: string[]
): Promise<DescribeTablesData> => {
  const result: any = {};
  for (const table of tables) {
    const data = (
      await connection.query(
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
        AND TABLE_SCHEMA = '${connection.config.database}';`
      )
    )["0"] as Array<{
      COLUMN_NAME: string;
      COLUMN_TYPE: string;
      IS_NULLABLE: "YES" | "NO";
      COLUMN_KEY: string | null;
      COLUMN_DEFAULT: string | null;
      EXTRA: string | null;
      COLUMN_COMMENT: string | null;
    }>;
    result[table] = { data, TABLE_NAME: table };
  }
  return result;
};
