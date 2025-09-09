import {Observable} from 'rxjs';
import {Guid} from 'guid-typescript';

export type Primitives = string | number | boolean | Date | null;
export interface ColumnDef<T> {
  key: keyof T;
  title: string,
  width?: string,
  sortable?: boolean,
  cell?:(row: T) => Primitives;
}

export type FilterOperator = 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'contains' | 'startsWith' | 'endsWith';

export interface FilterDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'daterange' | 'boolean';
  operators: FilterOperator[];
  optionsEndpoint?: string; // For select/multiselect types
  optionsStatic?:Array<{label: string, value: Primitives}>;
  defaultOperator?: FilterOperator;
}

export interface ApiQueryParam {
  field: string;
  operator: FilterOperator;
  value?: any;
}

export interface ApiAdapter<T> {
  buildQuery(filters: ApiQueryParam[], sort?: {field: string, direction: 'asc' | 'desc'}, limit?: number, offset?: number): Record<string, any>;
  list(query: Record<string, any>): Observable<{data: T[], total: number}>;
  get(id: Guid): Observable<T>;
  create(data: Partial<T>): Observable<T>;
  update(id: Guid, data: Partial<T>): Observable<T>;
  delete(id: Guid): Observable<void>;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select' | 'multiselect' | 'date' | 'checkbox';
  required?: boolean;
  options?: Array<{label: string, value: Primitives}>;
}

export interface ModelConfig<T> {
  name: string;
  title: string;
  columns: ColumnDef<T>[];
  filters?: FilterDef[];
  form: {fields: FormField[]};
  api: ApiAdapter<T>;
  idKey: keyof T;
}
