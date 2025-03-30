import mysql, { Connection } from "mysql2/promise";

interface MySQLConnectionParam {
  database: string;
  user: string;
  password: string;
  host: string;
  port: number;
}

export const getConnection = async ({
  database,
  host,
  password,
  port,
  user,
}: MySQLConnectionParam): Promise<Connection | boolean> => {
  try {
    return await mysql.createConnection({
      database,
      password,
      user,
      port,
      host,
    });
  } catch {
    return false;
  }
};
