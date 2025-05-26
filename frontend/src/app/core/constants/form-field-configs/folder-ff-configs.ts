import {FormFieldConfig} from '../../configs/form-field.interface';
import {MaxLengthValidator, Validators} from '@angular/forms';
import {FieldType} from '../../types/modal-field-type';

export const FolderFormFieldsConfig: FormFieldConfig[] = [
  {
    key: "title",
    label: "Название",
    type: "text",
    required: true,
    validators: [
      Validators.maxLength(20),
      Validators.minLength(1),
    ]
  },
  {
    key: "description",
    label: "Описание",
    type: "text",
    validators: [
      Validators.maxLength(500),
      Validators.minLength(1),
    ]
  },
]
