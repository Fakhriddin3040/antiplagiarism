import {FieldType} from '../types/modal-field-type';



export interface FormFieldSearchConfig {
  apiUrl: string;
  searchProps: string[];
}

export interface FormFieldConfig {
  key: string;
  label: string;
  type: FieldType | any;
  required?: boolean;
  options?: { value: any; label: string }[];
  validators?: any[];
  default?: any;
  additionalProps?: {
    search?: FormFieldSearchConfig;
  }
}
