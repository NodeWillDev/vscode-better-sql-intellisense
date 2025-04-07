/**
 * @description Regular expression to check if there is any SQL code within the text
 */
export const SQL =
  /(["'`])(?:SELECT|CREATE|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|ON|LIKE|GROUP BY|ORDER BY|LIMIT)[^"'`]*\1/gi;

/**
 * @description Regular expression to find tables
 */
export const TABLE =
  /\b(FROM|JOIN|UPDATE|INTO|DELETE\s+FROM|TRUNCATE|REPLACE|MERGE\s+INTO)\s*$/i;

/**
 * @description Regular Expression to get columns and tables
 */
export const COLUMNS =
  /\bSELECT\b\s+(.*?)\s+\bFROM\b\s+[`"'`]?(?<table>\w+)[`"'`]?(?=\s|$)|\bINSERT\s+INTO\b\s+[`"'`]?(?<table>\w+)[`"'`]?\s*\((?<insert_cols>[^)]+)\)|\bUPDATE\b\s+[`"'`]?(?<table>\w+)[`"'`]?\s+\bSET\b\s+(?<update_set>[^;]+?)(?=\s+\bWHERE\b|$)|\bDELETE\s+FROM\b\s+[`"'`]?(?<table>\w+)[`"'`]?(?=\s|$)/gim;
