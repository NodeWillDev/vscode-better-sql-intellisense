import { Connection } from "mysql2/promise";

export const loadedAllTables = async (
  connection: Connection
): Promise<string[]> => {
  return (
    (await connection.query("SHOW TABLES"))[0] as Array<{
      [key: string]: string;
    }>
  ).map((row: { [key: string]: string }) => Object.values(row)[0]);
};
