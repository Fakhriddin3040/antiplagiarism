import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef, HostListener,
  inject, input, model, signal,
  Output, EventEmitter,              // ← добавлено
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { ActionDef, ToolbarAction, ColumnDef, FilterDef, Page, Query, SortDir, TableDataSource } from './types/table';
import {SmartSelectComponent} from '../smart-select/smart-select.component'; // ← ToolbarAction добавлен

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, NgTemplateOutlet, SmartSelectComponent],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataTableComponent<T> {
  // inputs
  columns    = input<ColumnDef<T>[]>([]);
  filters    = input<FilterDef<T>[]>([]);
  actions    = input<ActionDef<T>[]>([]);
  dataSource = input.required<TableDataSource<T>>();

  // deps
  private readonly router = inject(Router);
  private readonly route  = inject(ActivatedRoute);
  private readonly host   = inject(ElementRef<HTMLElement>);

  // state
  readonly selection = new SelectionModel<T>(true, []);
  readonly query  = model<Query>({ limit: 10, offset: 0, sort: [], search: '', filters: {} });
  readonly page   = signal<Page<T>>({ rows: [], count: 0 });
  readonly loading = signal(false);

  // menus / filters popover
  readonly rowMenuOpen  = signal<T | null>(null);
  readonly bulkMenuOpen = signal(false);
  readonly filtersOpen  = signal(false);
  readonly draft        = signal<Record<string, any>>({}); // черновик значений фильтров

  // derived
  readonly items  = computed(() => this.page().rows);
  readonly total  = computed(() => this.page().count);
  readonly search = computed(() => this.query().search ?? '');

  readonly toolbarActions = computed(() => this.actions().filter(a => a.scope === 'toolbar'));
  readonly rowActions     = computed(() => this.actions().filter(a => a.scope === 'row'));
  readonly bulkActions    = computed(() => this.actions().filter(a => a.scope === 'bulk'));

  readonly displayedColumns = computed(() => {
    const base = this.columns().map(c => String(c.key));
    const selectCol  = this.bulkActions().length ? ['__select'] : [];
    const actionsCol = (this.rowActions().length || this.bulkActions().length) ? ['__actions'] : [];
    return [...selectCol, ...base, ...actionsCol];
  });

  readonly activeFiltersCount = computed(() => {
    const v = this.query().filters ?? {};
    return Object.values(v).filter(x => !(x === '' || x == null || (Array.isArray(x) && x.length === 0))).length;
  });

  // ---------- toolbar: Output + селекторы + helpers ----------
  @Output() toolbarAction = new EventEmitter<{ id: string; selection: T[]; query: Query }>();

  readonly firstToolbarAction  = computed(() => this.toolbarActions()[0] ?? null);
  readonly otherToolbarActions = computed(() => this.toolbarActions().slice(1));

  isToolbarDisabled(a: ToolbarAction<T>) {
    return a.disabled ? a.disabled({ selection: this.selection.selected, query: this.query() }) : false;
  }

  async onToolbarClick(a: ToolbarAction<T>) {
    // наружу событие
    this.toolbarAction.emit({ id: a.id, selection: this.selection.selected, query: this.query() });
    // локальный обработчик (если задан)
    if (a.run) {
      await a.run({ selection: this.selection.selected, query: this.query(), reload: () => this.reload() });
    }
  }

  // ---------- UI helpers ----------
  toKey(c: ColumnDef<T>) { return String(c.key); }
  rowMenuOpenedFor = (row: T) => this.rowMenuOpen() === row;
  toggleFilters()  { this.filtersOpen.update(v => !v); }
  toggleBulkMenu(ev: MouseEvent) { ev.stopPropagation(); this.bulkMenuOpen.update(v => !v); this.rowMenuOpen.set(null); }
  toggleRowMenu(row: T, ev: MouseEvent) { ev.stopPropagation(); this.rowMenuOpen.set(this.rowMenuOpen() === row ? null : row); this.bulkMenuOpen.set(false); }
  closeMenus() { this.rowMenuOpen.set(null); this.bulkMenuOpen.set(false); }
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) { if (!this.host.nativeElement.contains(ev.target)) { this.filtersOpen.set(false); this.closeMenus(); } }

  // ---------- FILTERS: draft & apply ----------
  private patchDraft(patch: Record<string, any>) { this.draft.update(d => ({ ...d, ...patch })); }
  getDraftVal(f: FilterDef<T>) { return this.draft()[String(f.field)]; }
  getRangeVal(f: FilterDef<T>, part: 'start'|'end') {
    const key = part === 'start' ? `${String(f.field)}_from` : `${String(f.field)}_to`;
    return this.draft()[key];
  }
  onFilterInput(f: FilterDef<T>, value: any) {
    const patch = f.toQuery ? f.toQuery(value) : { [String(f.field)]: value };
    this.patchDraft(patch);
  }
  onFilterRangeInput(f: FilterDef<T>, part: 'start'|'end', value: any) {
    const key = part === 'start' ? `${String(f.field)}_from` : `${String(f.field)}_to`;
    this.patchDraft({ [key]: value });
  }
  resetDraft() { this.draft.set({}); }

  private clean(obj: Record<string, any>) {
    const out: Record<string, any> = {};
    for (const [k, v] of Object.entries(obj)) {
      if (!(v === '' || v == null || (Array.isArray(v) && v.length === 0))) out[k] = v;
    }
    return out;
  }

  applyFilters(close = false) {
    const next = this.clean(this.draft());
    this.updateQuery({ filters: next, offset: 0 });
    if (close) this.filtersOpen.set(false);
  }
  resetFilters(apply = true, close = false) {
    this.resetDraft();
    if (apply) this.updateQuery({ filters: {}, offset: 0 });
    if (close) this.filtersOpen.set(false);
  }

  // ---------- filters / search (immediate mode) ----------
  onFilterChange(f: FilterDef<T>, value: any) {
    const patch = f.toQuery ? f.toQuery(value) : { [String(f.field)]: value };
    const next  = { ...(this.query().filters || {}), ...patch };
    this.updateQuery({ filters: next, offset: 0 });
  }
  onFilterRangeChange(f: FilterDef<T>, part: 'start'|'end', value: any) {
    const key = part === 'start' ? `${String(f.field)}_from` : `${String(f.field)}_to`;
    const next = { ...(this.query().filters || {}), [key]: value };
    this.updateQuery({ filters: next, offset: 0 });
  }
  onSearch(value: string) { this.updateQuery({ search: value, offset: 0 }); }

  // ---------- data ----------
  reload() {
    this.loading.set(true);
    this.dataSource().fetch(this.query()).subscribe({
      next: p => { this.page.set(p); this.selection.clear(); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }

  // ---------- paginator / sort ----------
  onPage(e: PageEvent) { this.updateQuery({ offset: e.pageIndex * e.pageSize, limit: e.pageSize }, false); this.reload(); }
  onSort(e: Sort) {
    const s = e.direction ? [{ field: e.active, dir: this.toSortDir(e.direction) }] : [];
    this.updateQuery({ sort: s, limit: 0 });
  }

  // ---------- selection ----------
  toggle(row: T) { this.selection.toggle(row); }
  isAllSelected() { return this.items().length > 0 && this.selection.selected.length === this.items().length; }
  masterToggle() { this.isAllSelected() ? this.selection.clear() : this.items().forEach(r => this.selection.select(r)); }

  // ---------- actions ----------
  isEnabled(a: ActionDef<T>, row?: T) {
    if (a.scope === 'toolbar') {
      return !this.isToolbarDisabled(a);
    }
    const ctx = { row, selection: this.selection.selected };
    if (a.requiresSelection && !ctx.selection.length) return false;
    return a.canEnable ? a.canEnable(ctx) : true;
  }

  async run(a: ActionDef<T>, row?: T) {
    // toolbar-экшены запускаются через onToolbarClick
    if (a.scope === 'toolbar') return;
    if (a.requiresConfirm && !confirm(`Вы уверены, что хотите выполнить действие "${a.label}"?`)) return;
    await a.run({ row, selection: this.selection.selected, reload: () => this.reload() });
    this.closeMenus();
  }

  // ---------- URL <-> state ----------
  private toSortDir(v: string | null | undefined): SortDir { return v === 'desc' ? 'desc' : 'asc'; }
  private parseSort(str: string | null): { field: string; dir: SortDir }[] {
    return (str ?? '')
      .split(',').filter(Boolean)
      .map(x => { const [field, dir] = x.split(':'); return { field, dir: this.toSortDir(dir) }; });
  }
  private stringifySort(s: { field: string; dir: SortDir }[]) { return (s ?? []).map(x => `${x.field}:${x.dir}`).join(','); }
  private updateQuery(patch: Partial<Query>, reload = true) {
    this.query.update(q => ({ ...q, ...patch }));
    if (reload) this.reload();
  }

  constructor() {
    // URL -> state (init)
    effect(() => {
      const qp = this.route.snapshot.queryParamMap;
      this.query.set({
        offset: +(qp.get('offset') ?? 0),
        limit: +(qp.get('limit') ?? 25),
        search: qp.get('q') ?? '',
        sort: this.parseSort(qp.get('sort')),
        filters: qp.get('filters') ? JSON.parse(qp.get('filters')!) : {},
      });
      this.reload();
    });

    // state -> URL
    effect(() => {
      const q = this.query();
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          offset: q.offset,
          limit: q.limit,
          q: q.search || null,
          sort: this.stringifySort(q.sort ?? [] ) || null,
          filters: Object.keys(q.filters ?? {}).length ? JSON.stringify(q.filters) : null,
        },
        queryParamsHandling: 'merge',
      });
    });
  }

  protected readonly Array = Array;
  protected readonly String = String;
}
