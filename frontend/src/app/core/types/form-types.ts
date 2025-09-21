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
export type ModalTextField = ModalBaseField & {
  kind: 'text' | 'textarea';
  rows?: number; // для textarea
};

export type ModalNumberField = ModalBaseField & {
  kind: 'number';
  min?: number;
  max?: number;
  step?: number;
};

export type ModalDateField = ModalBaseField & {
  kind: 'date';
};

export type ModalBoolField = ModalBaseField & {
  kind: 'bool' | 'checkbox';
};

// асинхронный select (smart select, шлём только id)
export type ModalSelectAsyncField<T = any> = ModalBaseField<T> & {
  kind: 'select-async';
  load: (term: string) => Observable<readonly T[] | T[]>;
  labelOf: (item: T) => string;
  idOf: (item: T) => string | number;
  initialId?: string | number | null;
};

// файлы
export type ModalFileField = ModalBaseField & {
  kind: 'file';
  multiple?: boolean;
  accept?: string;
  maxSizeMb?: number;
};

// итоговый union
export type ModalFieldDef =
  | ModalTextField
  | ModalNumberField
  | ModalDateField
  | ModalBoolField
  | ModalSelectAsyncField
  | ModalFileField;

// результат модалки
export type ModalResult<T = any> = {
  confirmed: boolean;
  value?: T;
};
