// types/table.ts
import {Observable} from 'rxjs';
import {TemplateRef} from '@angular/core';

export type SortDir = 'asc' | 'desc';

export type Query = {
  page: number; size: number;
  sort?: { field: string; dir: SortDir }[];
  search?: string;
  filters?: Record<string, unknown>; // уже нормализованные значения
};

export type Page<T> = { items: T[]; total: number };

export type Accessor<T> = (row: T) => unknown;

export type ColumnDef<T> = {
  key: keyof T | string;
  header: string;
  width?: string | number;
  sticky?: 'start'|'end';
  sortable?: boolean;
  accessor?: Accessor<T>;           // если key недостаточно
  cellTemplate?: TemplateRef<any> | null;  // кастомная ячейка
};

export type FilterOp = 'eq'|'ne'|'in'|'nin'|'gt'|'lt'|'gte'|'lte'|'like'|'between';

export type FilterDef<T> = {
  field: keyof T | string;
  label: string;
  type: 'text'|'select'|'multi'|'number'|'numberRange'|'date'|'dateRange'|'chips'|'bool';
  options?: Array<{label:string; value:any}> | (()=>Observable<any[]>);
  operators?: FilterOp[];
  toQuery?: (value:any)=>Record<string, unknown>; // кастом маппер в API
  placeholder?: string;
  width?: number;
};

export type ActionScope = 'row'|'bulk'|'toolbar';
export type ActionDef<T> = {
  id: string;
  label: string;
  icon?: string;
  scope: ActionScope;
  requiresConfirm?: boolean;
  requiresSelection?: boolean;
  canEnable?: (ctx:{row?:T, selection:T[]})=>boolean;
  run: (ctx:{row?:T, selection:T[], reload:()=>void})=>void|Promise<void>;
};

export interface TableDataSource<T> {
  fetch(q: Query): Observable<Page<T>>;
}
