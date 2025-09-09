import {FormFieldConfig} from '../form-field.interface';
import {Validators} from '@angular/forms';

export const AuthorModalConfigs: FormFieldConfig[] = [
  {
    key: 'firstName',
    type: 'text',
    label: 'Имя',
    required: true,
    validators: [
      Validators.minLength(2),
      Validators.maxLength(50)
    ]
  },
  {
    key: 'lastName',
    type: 'text',
    label: 'Фамилия',
    required: true,
    validators: [
      Validators.minLength(2),
      Validators.maxLength(50)
    ]
  },
  {
    key: 'description',
    type: 'text',
    label: 'Описание',
    required: false,
  }
]
