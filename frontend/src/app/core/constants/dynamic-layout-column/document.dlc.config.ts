import {ColumnConfig} from '../../configs/dynamic-layout-column.config';

export const DocumentDlcConfig: ColumnConfig[] = [
  {
    key: 'title',
    label: 'Назавние',
    type: 'text',
    width: '300px',
  },
  {
    key: 'createdAt',
    label: 'Создан',
    type: 'datetime',
    width: '300px'
  },
  {
    key: 'updatedAt',
    label: 'Обновлен',
    type: 'datetime',
    width: '300px',
  }
]
