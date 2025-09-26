import {AfterViewInit, Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {ActionDef, ColumnDef, Query} from '../data-table/types/table';
import {Document} from '../../core/features/document/types/document.types';
import {AppDataTableComponent} from '../data-table/data-table.component';
import {DOCUMENT_DATA_SOURCE, DOCUMENT_SERVICE} from '../../core/features/document/document.tokens';
import {DatePipe} from '@angular/common';
import {DocumentModalService} from '../../features/document/document.modal.service';

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
  documentService = inject(DOCUMENT_SERVICE);
  modalService = inject(DocumentModalService);

  @ViewChild('createdAtTpl', { read: TemplateRef }) createdAtTpl!: TemplateRef<any>;
  @ViewChild('updatedAtTpl', { read: TemplateRef }) updatedAtTpl!: TemplateRef<any>;

  readonly columns: ColumnDef<Document>[] = [
    { key: 'title', header: 'Название', sortable: true },
    { key: 'createdAt', header: 'Создан', sortable: true },
    { key: 'updatedAt', header: 'Обновлен', sortable: true },
  ]

  readonly actions: ActionDef<Document>[] = [
    { id: 'bulkDelete', label: 'Удалить', scope: 'bulk', requiresConfirm: true, run: (ctx) => {
        ctx.selection.forEach(
          (row) => this.onDelete({row: row, selection: null!, reload: ctx.reload })
        )
      }
    },
    { id: 'delete', label: 'Удалить', scope: 'row', requiresConfirm: true,
      run: (ctx) => this.onDelete(ctx)
    },
    { 'id': 'edit', label: 'Редактировать', scope: 'row',
      run: (_) => {}
    },
    { id: 'Create', label: 'Создать', scope: 'toolbar', variant: 'primary', run: (ctx) => this.onCreate(ctx)
    }
  ]

  onCreate(ctx: { selection: Document[], query: Query, reload: () => void }): void {
    this.modalService.openOnCreate().subscribe({
      next: (result) => {
        if (!result.confirmed) {
          return
        }
          let createSuccess = false;
          this.documentService.create(result.value!).subscribe({
            next: () => {
              createSuccess = true;
              ctx.reload;
            },
            error: (err) => {
              console.error(err);
            },
          });
          if (createSuccess) {
            ctx.reload();
          }
      },
      error: err => {
        console.error(err);
      }
    });
  }

  onDelete(ctx: { row?: Document, selection: Document[], reload: () => void }): void {
    this.documentService.delete(ctx.row!.id!).subscribe({
      next: () => {
        ctx.reload();
      },
      error: (err) => {
        console.log("Error deleting document:");
        console.error(err);
      }
    })
  }

  ngAfterViewInit(): void {
    this.columns.find(c => c.key === 'createdAt')!.cellTemplate = this.createdAtTpl;
    this.columns.find(c => c.key === 'updatedAt')!.cellTemplate = this.updatedAtTpl;
  }
}
