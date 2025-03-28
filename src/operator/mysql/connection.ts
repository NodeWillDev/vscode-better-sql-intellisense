import mysql, { Connection } from "mysql2/promise";

interface MySQLConnectionData {
  port: number;
  user: string;
  password: string;
  database: string;
  host: string;
}

export const connection = async (
  data: MySQLConnectionData
): Promise<Connection | boolean> => {
  try {
    return await mysql.createConnection({
      user: data.user,
      password: data.password,
      port: data.port,
      host: data.host,
      database: data.database,
    });
  } catch {
    return false;
  }
};
