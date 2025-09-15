// types/table.ts
import {Observable} from 'rxjs';
import {TemplateRef} from '@angular/core';

export type SortDir = 'asc' | 'desc';

export type Query = {
  page: number; size: number;
  sort?: { field: string; dir: SortDir }[];
  search?: string;
  filters?: Record<string, any>; // уже нормализованные значения
};

export type Page<T> = { items: T[]; total: number };

export type Accessor<T> = (row: T) => any;

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

export type FilterType =
  | 'text'|'select'|'multi'|'number'|'numberRange'
  | 'date'|'dateRange'|'chips'|'bool'
  | 'asyncSelect';

export type FilterDef<T> = {
  field: keyof T | string;
  label: string;
  type: 'text'|'select'|'multi'|'number'|'numberRange'|'date'|'dateRange'|'chips'|'bool';
  options?: Array<{label:string; value:any}> | (()=>Observable<any[]>);

  // ↓ новые (для async-select сценария)
  asyncOptions?: (term: string) => Observable<any[]>;
  labelOf?: (item: any) => string;
  idOf?: (item: any) => string | number;

  operators?: FilterOp[];
  toQuery?: (value:any)=>Record<string, unknown>;
  placeholder?: string;
  width?: number;
};

export type ActionScope = 'row'|'bulk'|'toolbar';

export type RowOrBulkAction<T> = {
  id: string;
  label: string;
  icon?: string;
  scope: 'row' | 'bulk';
  requiresConfirm?: boolean;
  requiresSelection?: boolean; // актуально для bulk
  canEnable?: (ctx: { row?: T; selection: T[] }) => boolean;
  run: (ctx: { row?: T; selection: T[]; reload: () => void }) => void | Promise<void>;
};

export type ToolbarVariant = 'primary' | 'secondary' | 'ghost';

export type ToolbarAction<T = any> = {
  id: string;
  label: string;
  icon?: string;
  scope: 'toolbar';
  variant?: ToolbarVariant;                // как рисовать кнопку
  disabled?: (ctx: { selection: T[]; query: Query }) => boolean;
  run?: (ctx: { selection: T[]; query: Query; reload: () => void }) => void | Promise<void>; // опционально
};

export type ActionDef<T> = RowOrBulkAction<T> | ToolbarAction<T>;

export interface TableDataSource<T> {
  fetch(q: Query): Observable<Page<T>>;
}
