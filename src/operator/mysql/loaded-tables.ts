import { connection } from "./connection";

export const loadedTables = async () => {
  const database = await connection();
  console.log(database);
};

(async () => {
  loadedTables();
})();
