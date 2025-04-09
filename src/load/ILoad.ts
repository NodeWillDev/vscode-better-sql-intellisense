export type DatabaseType = {
  COLUMN_NAME: string;
  COLUMN_TYPE: string;
  IS_NULLABLE: string;
  COLUMN_KEY: string;
  COLUMN_DEFAULT: string | null;
  EXTRA: string;
  COLUMN_COMMENT: string;
};

export interface ILoad {
  data: Record<string, { name: string; data: DatabaseType[] }>;
  init(): Promise<void>;
}
