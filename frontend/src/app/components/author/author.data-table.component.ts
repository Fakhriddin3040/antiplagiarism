import {AfterViewInit, Component, inject, TemplateRef, ViewChild} from '@angular/core';
import { AppDataTableComponent } from '../data-table/data-table.component';
import {AUTHOR_SERVICE} from '../../core/features/author/author.service.token';
import {AUTHOR_TABLE_DATA_SOURCE} from '../../core/features/author/author.table-data-source.token';
import {Author} from '../../core/features/author/types/author.types';
import {ActionDef, ColumnDef, Query} from '../data-table/types/table';
import {FormModalService} from '../../core/services/form-modal.service';
import {ModalFieldDef} from '../../core/types/form-types';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-author-data-table',
  imports: [
    AppDataTableComponent,
    DatePipe,
  ],
  templateUrl: './author.data-table.component.html',
  styleUrl: './author.data-table.component.scss'
})
export class AuthorDataTableComponent implements AfterViewInit{
  authorService = inject(AUTHOR_SERVICE);
  dataSource = inject(AUTHOR_TABLE_DATA_SOURCE);
  formModalService = inject(FormModalService);

  @ViewChild('createdAtTpl', { read: TemplateRef }) createdAtTpl!: TemplateRef<any>;
  @ViewChild('updatedAtTpl', { read: TemplateRef }) updatedAtTpl!: TemplateRef<any>;

  readonly columns: ColumnDef<Author>[] = [
    { key: 'firstName', header: 'Имя', accessor: (a) => a.firstName, sortable: true },
    { key: 'lastName', header: 'Фамилия', accessor: (a) => a.lastName, sortable: true},
    { key: 'description', header: 'Короткое описание', accessor: (a) => {
        if (a.description && a.description.length > 30) {
          return a.description!.substring(0, 30) + '...';
        }
        return a.description;
      }
    },
    { key: 'createdAt', header: 'Создан', accessor: (a) => a.createdAt, sortable: true },
    { key: 'updatedAt', header: 'Обновлен', accessor: (a) => a.updatedAt, sortable: true },
  ]
  readonly actions: ActionDef<Author>[] = [
    { id: 'bulkDelete', label: 'Удалить', scope: 'bulk', requiresConfirm: true, run: (ctx) => this.onBulkDelete(ctx)
    },
    { id: 'delete', label: 'Удалить', scope: 'row', requiresConfirm: true,
      run: (ctx) => this.onDelete(ctx)
    },
    { 'id': 'edit', label: 'Редактировать', scope: 'row',
      run: (ctx) => this.onUpdate(ctx)
    },
    { id: 'Create', label: 'Создать', scope: 'toolbar', variant: 'primary', run: (ctx) => this.onCreate(ctx)
    }
  ]

  readonly formModalFields: ModalFieldDef[] = [
    { key: 'firstName', kind: 'text', label: 'Имя', required: true },
    { key: 'lastName', kind: 'text', label: 'Фамилия', required: true },
    { key: 'description', kind: 'textarea', label: 'Описание', required: false , rows: 4}
  ]

  ngAfterViewInit() {
    this.columns.find(c => c.key === 'createdAt')!.cellTemplate = this.createdAtTpl;
    this.columns.find(c => c.key === 'updatedAt')!.cellTemplate = this.updatedAtTpl;
  }

  onCreate(ctx: { selection: Author[]; query: Query; reload: () => void }) {
    this.formModalService.open<Author>({
      title: 'Создать автора',
      fields: this.formModalFields,
      requireConfirm: true
    }).subscribe({
      next: data => {
        if (!data.confirmed) {
          return;
        }
        this.authorService.create(data!.value!).subscribe({
          next: () => {
            ctx.reload();
          },
          error: err => {
            console.error(`Error occurred while creating author: ${err.message}`);
          }
        })
      },
      error: err => {
        console.error(`Error occurred in form modal: ${err.message}`);
      }
    })
  }
  onUpdate(ctx: { row?: Author; selection: Author[]; reload: () => void }){
    this.formModalService.open<Author>({
      title: 'Редактировать автора',
      fields: this.formModalFields,
      initialValue: ctx.row!,
      requireConfirm: true
    }).subscribe({
      next: data => {
        if (!data.confirmed) {
          return;
        }
        this.authorService.update(ctx.row!.id, data!.value!).subscribe({
          next: () => {
            ctx.reload();
          },
          error: err => {
            console.error(`Error occurred while updating author: ${err.message}`);
          }
        })
      },
      error: err => {
        console.error(`Error occurred in form modal: ${err.message}`);
      }
    })
  }
  onDelete(ctx: { row?: Author; selection: Author[]; reload: () => void }) {
    this.authorService.delete(ctx.row!.id).subscribe({
      next: () => ctx.reload(),
      error: err => {
        console.error(err);
        alert('Failed to delete author');
      }
    });
  }
  onBulkDelete(ctx: { row?: Author; selection: Author[]; reload: () => void }) {
    this.authorService.bulkDelete(ctx.selection.map(a => a.id));
    ctx.reload();
  }
}
