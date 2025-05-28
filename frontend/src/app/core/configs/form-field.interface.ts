import {FieldType} from '../types/modal-field-type';

export interface FormFieldConfig<T> {
  key: keyof T;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: any; label: string }[];
  validators?: any[];
  default?: any;
}
