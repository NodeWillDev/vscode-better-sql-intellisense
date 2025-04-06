/**
 * @description Regular expression to check if there is any SQL code within the text
 */
export const Regex =
  /(["'`])(?:SELECT|CREATE|INSERT|UPDATE|DELETE|FROM|WHERE|JOIN|ON|LIKE|GROUP BY|ORDER BY|LIMIT)[^"'`]*\1/gi;
