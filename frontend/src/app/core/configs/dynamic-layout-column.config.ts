export interface ColumnConfig {
  key: string;
  label: string;
  type: 'text' | 'datetime' | 'status';
  width?: string;
}
