import {
  AfterViewInit, Component, TemplateRef, ViewChild, inject, signal, DestroyRef,
} from '@angular/core';
import {AsyncPipe, DatePipe} from '@angular/common';
import {Subject, of, filter, map} from 'rxjs';
import {switchMap, catchError, tap, startWith, distinctUntilChanged} from 'rxjs/operators';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';

import {Document} from '../../core/features/document/types/document.types';
import {DOCUMENT_DATA_SOURCE, DOCUMENT_SERVICE} from '../../core/features/document/document.tokens';
import {PLAGIARISM_CHECK_SERVICE} from '../../core/features/plagiarism-check/plagiarism-check.tokens';
import {DocumentModalService} from '../../features/document/document.modal.service';
import {PlagiarismCheck} from '../../core/features/plagiarism-check/types/plagiarism-check.types';

import {AppDataTableComponent} from '../data-table/data-table.component';
import {PlagiarismCheckCardComponent} from '../plagiarism-check-card/plagiarism-check-card.component';
import {ActionDef, ColumnDef, Query} from '../data-table/types/table';

@Component({
  selector: 'app-document.data-table',
  standalone: true,
  imports: [
    AppDataTableComponent,
    DatePipe,
    PlagiarismCheckCardComponent,
    AsyncPipe,
  ],
  templateUrl: './document.data-table.component.html',
  styleUrls: ['./document.data-table.component.scss'],
})
export class DocumentDataTableComponent implements AfterViewInit {
  // DI
  dataSource = inject(DOCUMENT_DATA_SOURCE);
  documentService = inject(DOCUMENT_SERVICE);
  modalService = inject(DocumentModalService);
  plagiarismCheckService = inject(PLAGIARISM_CHECK_SERVICE);
  destroyRef = inject(DestroyRef);

  // UI state
  openedRow = signal<Document | null>(null);
  loading = signal<boolean>(false);

  // templates
  @ViewChild('createdAtTpl', { read: TemplateRef }) createdAtTpl!: TemplateRef<any>;
  @ViewChild('updatedAtTpl', { read: TemplateRef }) updatedAtTpl!: TemplateRef<any>;
  @ViewChild('titleTpl',   { read: TemplateRef }) titleTpl!: TemplateRef<any>;

  readonly columns: ColumnDef<Document>[] = [
    { key: 'title',     header: 'Название', sortable: true },
    { key: 'createdAt', header: 'Создан',   sortable: true },
    { key: 'updatedAt', header: 'Обновлен', sortable: true },
  ];

  readonly actions: ActionDef<Document>[] = [
    {
      id: 'bulkDelete', label: 'Удалить', scope: 'bulk', requiresConfirm: true,
      run: (ctx) => (ctx.selection ?? []).forEach(row => this.onDelete({row, selection: [], reload: ctx.reload}))
    },
    {
      id: 'delete', label: 'Удалить', scope: 'row', requiresConfirm: true,
      run: (ctx) => this.onDelete(ctx)
    },
    {
      id: 'edit', label: 'Редактировать', scope: 'row',
      run: (_) => {}
    },
    {
      id: 'Create', label: 'Создать', scope: 'toolbar', variant: 'primary',
      run: (ctx) => this.onCreate(ctx)
    }
  ];

  // ---- ПРОСТО: один триггер на загрузку проверки ----
  private checkTrigger$ = new Subject<string>(); // documentId

  // Observable для карточки проверки
  check$ = toObservable(this.openedRow).pipe(
    filter((row): row is Document => !!row),         // только когда есть строка
    map(row => row.id),
    distinctUntilChanged(),
    tap(() => this.loading.set(true)),
    switchMap((docId) =>
      this.plagiarismCheckService.getForDocument(docId).pipe(
        map(doc => {
          doc.coverage = Number((doc.coverage ? doc.coverage * 100 : 0).toFixed(3)); // в проценты
          doc.averageChunksSimilarity = Number((doc.averageChunksSimilarity! * 100).toFixed(3)); // в проценты
          doc.maxSimilarityScore = Number((doc.maxSimilarityScore! * 100).toFixed(3)); // в проценты
          return doc;
        }),
        catchError(err => {
          console.error('getForDocument error', err);
          return of<PlagiarismCheck | null>(null);
        }),
      )
    ),
    tap(() => this.loading.set(false)),
  );

  // Handlers
  openPlagiarismCheckCard(row: Document) {
    const current = this.openedRow();
    this.openedRow.set(current?.id === row.id ? null : row);
  }

  plagiarismRecheck(row: Document): void {
    if (!row?.id) return;
    // можно вызвать реальную перепроверку, а потом перезагрузить
    // this.loading.set(true);
    // this.plagiarismCheckService.recheck(row.id)
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe({ next: () => this.checkTrigger$.next(row.id), error: () => this.loading.set(false) });

    // пока просто перезагрузим текущую проверку
    this.checkTrigger$.next(row.id);
  }

  onCreate(ctx: { selection: Document[], query: Query, reload: () => void }): void {
    this.modalService.openOnCreate()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          if (!result?.confirmed) return;
          this.documentService.create(result.value!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => ctx.reload(),
              error: (err) => console.error(err),
            });
        },
        error: (err) => console.error(err),
      });
  }

  onDelete(ctx: { row?: Document, selection: Document[], reload: () => void }): void {
    if (!ctx.row?.id) return;
    this.documentService.delete(ctx.row.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => ctx.reload(),
        error: (err) => {
          console.log('Error deleting document:');
          console.error(err);
        }
      });
  }

  ngAfterViewInit(): void {
    this.columns.find(c => c.key === 'createdAt')!.cellTemplate = this.createdAtTpl;
    this.columns.find(c => c.key === 'updatedAt')!.cellTemplate = this.updatedAtTpl;
    this.columns.find(c => c.key === 'title')!    .cellTemplate = this.titleTpl;
  }

  protected readonly map = map;
}
