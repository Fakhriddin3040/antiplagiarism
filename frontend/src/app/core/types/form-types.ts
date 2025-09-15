// form-types.ts
import { Observable } from 'rxjs';
import { TemplateRef } from '@angular/core';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'bool'
  | 'checkbox'
  | 'select-async'   // smart select (строго id)
  | 'file';          // drag & drop

// базовое поле
export type BaseField<T = any> = {
  key: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  width?: number | string;
  disabled?: boolean;
  template?: TemplateRef<any>;
};

// текстовые
export type TextField = BaseField & {
  kind: 'text' | 'textarea';
  rows?: number; // для textarea
};

export type NumberField = BaseField & {
  kind: 'number';
  min?: number;
  max?: number;
  step?: number;
};

export type DateField = BaseField & {
  kind: 'date';
};

export type BoolField = BaseField & {
  kind: 'bool' | 'checkbox';
};

// асинхронный select (smart select, шлём только id)
export type SelectAsyncField<T = any> = BaseField<T> & {
  kind: 'select-async';
  load: (term: string) => Observable<readonly T[] | T[]>;
  labelOf: (item: T) => string;
  idOf: (item: T) => string | number;
  initialId?: string | number | null;
};

// файлы
export type FileField = BaseField & {
  kind: 'file';
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
};

// итоговый union
export type FieldDef =
  | TextField
  | NumberField
  | DateField
  | BoolField
  | SelectAsyncField
  | FileField;

// результат модалки
export type ModalResult<T = any> = {
  confirmed: boolean;
  value?: T;
};
