import { ChangeDetectionStrategy, Component, computed, effect, inject, input, model, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { AsyncPipe, NgTemplateOutlet, NgIf, NgFor } from '@angular/common';
import {ColumnDef, FilterDef, ActionDef, TableDataSource, Query, Page, SortDir} from './types/table';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, NgTemplateOutlet, AsyncPipe],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataTableComponent<T> {
  // Inputs (в виде сигналов Angular 16+)
  columns = input<ColumnDef<T>[]>([]);
  filters = input<FilterDef<T>[]>([]);
  actions = input<ActionDef<T>[]>([]);
  dataSource = input.required<TableDataSource<T>>();

  // State
  selection = new SelectionModel<T>(true, []);  // модель выбора (мультивыбор)
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals состояния
  query = model<Query>({ page: 0, size: 25, sort: [], search: '', filters: {} });
  page = signal<Page<T>>({ items: [], total: 0 });
  loading = signal<boolean>(false);

  // Derived signals (вычисляемые значения на основе состояния)
  items = computed(() => this.page().items);
  total = computed(() => this.page().total);
  search = computed(() => this.query().search ?? '');

  // Формируем массив имен колонок для отображения (динамически, включая опциональные колонки)
  displayedColumns = computed(() => {
    const baseCols = this.columns().map(c => c.key as string);
    const selectCol = this.bulkActions().length ? ['__select'] : [];
    const actionsCol = this.rowActions().length ? ['__actions'] : [];
    return [...selectCol, ...baseCols, ...actionsCol];
  });

  // Разделяем действия по их "области" (scope)
  toolbarActions = computed(() => this.actions().filter(a => a.scope === 'toolbar'));
  rowActions = computed(() => this.actions().filter(a => a.scope === 'row'));
  bulkActions = computed(() => this.actions().filter(a => a.scope === 'bulk'));

  // Утилитарный метод: получить строковый ключ колонки (учитывает, что c.key может быть символом или др.)
  toKey(c: ColumnDef<T>): string {
    return String(c.key);
  }

  // Обработчик изменения текстового фильтра и других одиночных значений
  onFilterChange(f: FilterDef<T>, value: any) {
    // Определяем патч для объекта filters в запросе
    const patch = f.toQuery ? f.toQuery(value) : { [f.field as string]: value };
    // Обновляем query: новый filters и сбрасываем на первую страницу
    this.query.update(q => ({ ...q, filters: { ...(q.filters || {}), ...patch }, page: 0 }));
    this.reload();
  }

  // Обработчик для диапазонных фильтров (например, dateRange или numberRange)
  onFilterRangeChange(f: FilterDef<T>, part: 'start' | 'end', value: any) {
    // Идентифицируем поля начала/конца диапазона (например, field_from, field_to)
    // Здесь предполагаем, что f.field содержит базовое имя, к которому добавим суффиксы.
    const baseField = f.field as string;
    const fieldName = part === 'start' ? `${baseField}_from` : `${baseField}_to`;
    const patch = { [fieldName]: value };
    this.query.update(q => ({ ...q, filters: { ...(q.filters || {}), ...patch }, page: 0 }));
    this.reload();
  }

  // Обработчик ввода в поисковое поле
  onSearch(value: string) {
    this.query.update(q => ({ ...q, search: value, page: 0 }));
    this.reload();
  }

  // Обновление данных (вызов dataSource)
  reload() {
    this.loading.set(true);
    // Вызываем источник данных (например, сервис с HTTP) с текущим Query
    this.dataSource().fetch(this.query()).subscribe({
      next: p => {
        this.page.set(p);
        this.loading.set(false);
        this.selection.clear(); // сбрасываем выделение после загрузки новой страницы
      },
      error: _ => {
        this.loading.set(false);
      }
    });
  }

  // Обработчик события пагинатора
  onPage(e: PageEvent) {
    this.query.update(q => ({ ...q, page: e.pageIndex, size: e.pageSize }));
    this.reload();
  }

  // Обработчик события сортировки (MatSort)
  onSort(e: Sort) {
    const s = e.direction ? [{ field: e.active, dir: e.direction as any }] : [];
    this.query.update(q => ({ ...q, sort: s, page: 0 }));
    this.reload();
  }

  // Selection helpers (помощники для работы с выделением строк)
  toggle(row: T) {
    this.selection.toggle(row);
  }
  isAllSelected() {
    // Выбраны все элементы текущей страницы?
    return this.items().length > 0 && this.selection.selected.length === this.items().length;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      // выделяем все элементы текущей загруженной страницы
      this.items().forEach(r => this.selection.select(r));
    }
  }

  // Проверка, активна ли данная кнопка действия
  isEnabled(a: ActionDef<T>, row?: T) {
    const ctx = { row, selection: this.selection.selected };
    // Если действие требует выбор, а ничего не выбрано - отключаем кнопку
    if (a.requiresSelection && ctx.selection.length === 0) return false;
    // Если определён специальный предикат canEnable, используем его
    return a.canEnable ? !!a.canEnable(ctx) : true;
  }

  // Выполнение действия
  async run(a: ActionDef<T>, row?: T) {
    // Формируем контекст для действия
    const ctx = { row, selection: this.selection.selected, reload: () => this.reload() };
    // Если требуется подтверждение от пользователя, запрашиваем его
    if (a.requiresConfirm) {
      const message = `Вы уверены, что хотите выполнить действие "${a.label}"?`;
      if (!confirm(message)) {
        return; // пользователь отменил
      }
    }
    // Выполняем действие (может быть синхронным или возвращать Promise)
    await a.run(ctx);
  }

  private toSortDir(v: string | null | undefined): SortDir {
    return v === 'desc' ? 'desc' : 'asc'; // всё, что не 'desc' — в 'asc'
  }

  constructor() {
    effect(() => {
      const qp = this.route.snapshot.queryParamMap;

      const page = +(qp.get('page') ?? 0);
      const size = +(qp.get('size') ?? 25);
      const search = qp.get('q') ?? '';

      const sort: { field: string; dir: SortDir }[] =
        (qp.get('sort') ?? '')
          .split(',')
          .filter(Boolean)
          .map(x => {
            const [field, dir] = x.split(':');
            return { field, dir: this.toSortDir(dir) };
          });

      const filters = qp.get('filters') ? JSON.parse(qp.get('filters')!) : {};

      this.query.set({ page, size, search, sort, filters });
      this.reload();
    });

    // Effect: при изменении состояния (query) обновляем URL (сохраняем параметры)
    effect(() => {
      const q = this.query();
      const sortStr = (q.sort ?? []).map(s => `${s.field}:${s.dir}`).join(',');
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          page: q.page,
          size: q.size,
          q: q.search || null,
          sort: sortStr || null,
          // сериализуем объект фильтров в JSON строку, либо удаляем параметр, если фильтров нет
          filters: Object.keys(q.filters ?? {}).length ? JSON.stringify(q.filters) : null
        },
        queryParamsHandling: 'merge'
      });
    });
  }

  protected readonly Array = Array;
}
