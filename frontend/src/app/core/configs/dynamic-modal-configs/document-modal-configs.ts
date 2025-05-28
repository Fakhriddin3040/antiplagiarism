import {FormFieldConfig} from '../form-field.interface';
import {Validators} from '@angular/forms';
import {Document} from '../../models/document.interface';

export const DocumentModalConfig: FormFieldConfig<DocumentRequest>[] = [
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
  {
    key: 'authorId',
    type: 'select',
    label: 'Автор документа',
    required: true,
  },
  {
    key: 'folderId',
    type: 'select',
    label: 'Папка документа',
    required: true,
  }
]
