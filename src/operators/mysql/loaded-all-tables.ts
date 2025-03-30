import { Connection } from "mysql2/promise";
import { getConnection } from "./get-connection";

export const loadedAllTables = async (
  connection: Connection
): Promise<String[]> => {
  return (
    (await connection.query("SHOW TABLES"))[0] as Array<{
      [key: string]: string;
    }>
  ).map((row: { [key: string]: string }) => Object.values(row)[0]);
};

(async () => {
  console.log(
    await loadedAllTables(
      (await getConnection({
        database: "ban",
        host: "localhost",
        password: "root",
        port: 3306,
        user: "root",
      })) as unknown as Connection
    )
  );
})();
