import {FormFieldConfig} from '../form-field.interface';
import {Validators} from '@angular/forms';
import {Document} from '../../models/document.interface';

export const DocumentModalConfig: FormFieldConfig[] = [
  {
    key: 'title',
    type: 'text',
    label: 'Название документа',
    required: true,
    validators: [
      Validators.minLength(3),
      Validators.maxLength(100)
    ]
  },
  {
    key: 'author',
    type: 'author-search',
    label: 'Автор документа',
    required: true,
    options: [
      {"value": 13, "label": "Иванов Иван Иванович"},
    ]
  },
  {
    key: 'folder',
    type: 'folder-search',
    label: 'Папка документа',
    required: true,
  },
  {
    key: 'description',
    type: 'textarea',
    label: 'Описание документа',
    required: false,
    validators: [
      Validators.minLength(10),
      Validators.maxLength(500)
    ]
  },
  {
    key: 'file',
    type: 'file-drop',
    label: 'Файл документа',
    required: true,
  },
]
