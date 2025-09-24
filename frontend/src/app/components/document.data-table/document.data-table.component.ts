import {AfterViewInit, Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {ActionDef, ColumnDef} from '../data-table/types/table';
import {Document} from '../../core/features/document/types/document.types';
import {Author} from '../../core/features/author/types/author.types';
import {AppDataTableComponent} from '../data-table/data-table.component';
import {DOCUMENT_DATA_SOURCE} from '../../core/features/document/document.tokens';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-document.data-table',
  imports: [
    AppDataTableComponent,
    DatePipe
  ],
  templateUrl: './document.data-table.component.html',
  styleUrl: './document.data-table.component.scss'
})
export class DocumentDataTableComponent implements AfterViewInit {
  dataSource = inject(DOCUMENT_DATA_SOURCE);

  @ViewChild('createdAtTpl', { read: TemplateRef }) createdAtTpl!: TemplateRef<any>;
  @ViewChild('updatedAtTpl', { read: TemplateRef }) updatedAtTpl!: TemplateRef<any>;

  readonly columns: ColumnDef<Document>[] = [
    { key: 'title', header: 'Название', sortable: true },
    { key: 'createdAt', header: 'Создан', sortable: true },
    { key: 'updatedAt', header: 'Обновлен', sortable: true },
  ]

  readonly actions: ActionDef<Document>[] = [
    { id: 'bulkDelete', label: 'Удалить', scope: 'bulk', requiresConfirm: true, run: (_) => {}
    },
    { id: 'delete', label: 'Удалить', scope: 'row', requiresConfirm: true,
      run: (_) => {}
    },
    { 'id': 'edit', label: 'Редактировать', scope: 'row',
      run: (_) => {}
    },
    { id: 'Create', label: 'Создать', scope: 'toolbar', variant: 'primary', run: (_) => {}
    }
  ]

  ngAfterViewInit(): void {
    this.columns.find(c => c.key === 'createdAt')!.cellTemplate = this.createdAtTpl;
    this.columns.find(c => c.key === 'updatedAt')!.cellTemplate = this.updatedAtTpl;
  }
}
