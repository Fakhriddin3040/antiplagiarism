// form-types.ts
import { Observable } from 'rxjs';
import { TemplateRef } from '@angular/core';

export type ModalFieldKind =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'bool'
  | 'checkbox'
  | 'select-async'   // smart select (строго id)
  | 'file';          // drag & drop

// базовое поле
export type ModalBaseField<T = any> = {
  key: string;
  label: string;
  kind: ModalFieldKind;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  width?: number | string;
  disabled?: boolean;
  template?: TemplateRef<any>;
};

// текстовые
export type ModalTextField<T = any> = ModalBaseField<T> & {
  kind: 'text' | 'textarea';
  rows?: number; // для textarea
};

export type ModalNumberField<T = any> = ModalBaseField<T> & {
  kind: 'number';
  min?: number;
  max?: number;
  step?: number;
};

export type ModalDateField<T = any> = ModalBaseField<T> & {
  kind: 'date';
};

export type ModalBoolField<T = any> = ModalBaseField<T> & {
  kind: 'bool' | 'checkbox';
};

// асинхронный select (smart select, шлём только id)
export type ModalSelectAsyncField<T = any, K = any> = ModalBaseField<T> & {
  kind: 'select-async';
  load: (term: string) => Observable<readonly K[] | K[]>;
  labelOf: (item: K) => string;
  idOf: (item: K) => string | number | string;
  initialId?: string | number | null;
};

// файлы
export type ModalFileField<T> = ModalBaseField<T> & {
  kind: 'file';
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
};

// итоговый union
export type ModalFieldDef<T = any, K = any> =
  | ModalTextField<T>
  | ModalNumberField<T>
  | ModalDateField<T>
  | ModalBoolField<T>
  | ModalSelectAsyncField<T, K>
  | ModalFileField<T>;

// результат модалки
export type ModalResult<T = any> = {
  confirmed: boolean;
  value?: T;
};
