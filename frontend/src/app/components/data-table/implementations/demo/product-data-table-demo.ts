import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { AppDataTableComponent } from '../../data-table.component';
import { ActionDef, ColumnDef, FilterDef, Query } from '../../types/table';
import {
  Product, ProductDataSource, makeProducts, CATEGORIES, Category
} from '../data-sources/product-data-table-source';

import {
  ModalFieldDef as FormFieldDef,
  ModalResult
} from '../../../../core/types/form-types';
import {DynamicFormModalComponent} from '../../../dynamic-form-modal/dynamic-form-modal.component';

@Component({
  selector: 'app-demo-products',
  standalone: true,
  imports: [AppDataTableComponent, NgClass, DecimalPipe, DynamicFormModalComponent],
  template: `
    <app-data-table
      #table
      [columns]="columns"
      [filters]="filters"
      [actions]="actions"
      [dataSource]="dataSource"
      (toolbarAction)="onToolbar($event)">
    </app-data-table>

    <!-- Кастомные ячейки -->
    <ng-template #priceTpl let-row>
      <span class="price-cell">{{ row.price | number:'1.2-2' }}</span>
    </ng-template>

    <ng-template #activeTpl let-row>
      <span class="badge" [ngClass]="row.active ? 'on' : 'off'">
        {{ row.active ? 'Active' : 'Inactive' }}
      </span>
    </ng-template>

    <!-- ✨ УЛЬТИМЕЙТ МОДАЛКА ФОРМЫ -->
    <app-dynamic-form-modal
      #form
      [title]="formTitle"
      [confirmLabel]="formConfirmLabel"
      [fields]="formFields"
      [initialValue]="formInitial"
      [requireConfirm]="true"
      (closed)="onFormClosed($event)">
    </app-dynamic-form-modal>
  `,
  styles: [`
    .badge { padding: 2px 8px; border-radius: 999px; font-size: 12px; }
    .badge.on { background:#e6ffed; color:#067d36; border:1px solid #b5f5c8; }
    .badge.off { background:#ffecec; color:#b61d1d; border:1px solid #ffc9c9; }
    .price-cell { font-variant-numeric: tabular-nums; }
  `]
})
export class DemoProductsComponent implements AfterViewInit {
  @ViewChild('priceTpl',  { read: TemplateRef }) priceTpl!: TemplateRef<any>;
  @ViewChild('activeTpl', { read: TemplateRef }) activeTpl!: TemplateRef<any>;

  // ссылки на детей
  @ViewChild('table', { read: AppDataTableComponent }) table!: AppDataTableComponent<Product>;
  @ViewChild('form',  { read: DynamicFormModalComponent }) form!: DynamicFormModalComponent;

  // мок-источник
  private ds = new ProductDataSource(makeProducts(120));
  dataSource = { fetch: this.ds.fetch.bind(this.ds) };

  // --- таблица
  columns: ColumnDef<Product>[] = [
    { key: 'name',      header: 'Name',      sortable: true },
    { key: 'sku',       header: 'SKU',       sortable: true },
    { key: 'category',  header: 'Category',  sortable: true },
    { key: 'price',     header: 'Price',     sortable: true, cellTemplate: null },
    { key: 'active',    header: 'Status',    sortable: false, cellTemplate: null },
    {
      key: 'createdAt', header: 'Created',   sortable: true,
      accessor: (r) => new Date(r.createdAt).toLocaleDateString()
    },
  ];

  filters: FilterDef<Product>[] = [
    {
      field: 'categoryId',
      label: 'Category',
      type: 'select',
      placeholder: 'All categories',
      options: CATEGORIES.map(c => ({ label: c.name, value: c.id })), // fallback для обычного select
      // SmartSelect ассинхронный — всегда шлём ИД
      asyncOptions: (term: string) => this.ds.searchCategories(term),
      labelOf: (c: Category) => c.name,
      idOf:    (c: Category) => c.id,
    } as any,
    { field: 'active',    label: 'Only active', type: 'bool' },
    { field: 'createdAt', label: 'Created At',  type: 'dateRange' },
    { field: 'sku',       label: 'SKU',         type: 'text',
      toQuery: (v: string) => v?.trim() ? ({ sku: v.trim() }) : ({}) },
  ];

  actions: ActionDef<Product>[] = [
    // ── TOOLBAR (первый — «большая» кнопка справа)
    {
      id: 'add',
      label: 'Add Product',
      scope: 'toolbar',
      run: async () => this.openCreateForm()
    },
    {
      id: 'export',
      label: 'Export CSV',
      scope: 'toolbar',
      run: async ({ query }) => {
        console.log('Export with query:', query);
        alert('Export started (demo)');
      }
    },

    // ── BULK
    {
      id: 'bulkDelete',
      label: 'Delete Selected',
      scope: 'bulk',
      requiresSelection: true,
      requiresConfirm: true,
      run: async ({ selection, reload }) => {
        const ids = selection.map(s => s.id);
        this.ds.removeByIds(ids);
        reload();
      }
    },

    // ── ROW
    { id: 'view', label: 'View', scope: 'row', run: async ({ row }) => alert(`Viewing ${row?.name}`) },
    {
      id: 'edit',
      label: 'Edit',
      scope: 'row',
      run: async ({ row }) => { if (row) this.openEditForm(row); }
    },
    {
      id: 'delete',
      label: 'Delete',
      scope: 'row',
      requiresConfirm: true,
      run: async ({ row, reload }) => { if (!row) return; this.ds.removeByIds([row.id]); reload(); }
    }
  ];

  // --- модалка: состояние и поля
  formTitle = 'Create Product';
  formConfirmLabel = 'Save';
  formInitial: Record<string, any> = {};

  // Поля формы: text, smart-select (ID), number, bool, date, file
  formFields: FormFieldDef[] = [
    { kind: 'text',   key: 'name',       label: 'Name',       required: true,  width: 6, placeholder: 'Name…' },
    { kind: 'text',   key: 'sku',        label: 'SKU',        required: true,  width: 6, placeholder: 'SKU…' },
    {
      kind: 'select-async', key: 'categoryId', label: 'Category', required: true, width: 6,
      placeholder: 'Type to search…',
      load: (term: string) => this.ds.searchCategories(term),      // Observable<Category[]>
      labelOf: (c: Category) => c.name,                            // как показать
      idOf:    (c: Category) => c.id,                              // всегда шлём ИД
      initialId: null                                              // можно выставлять при редактировании
    },
    { kind: 'text', key: 'price',      label: 'Price',      required: true,  width: 3},
    { kind: 'text',   key: 'active',     label: 'Active',     required: false, width: 3 },
    { kind: 'text',   key: 'createdAt',  label: 'Created At', required: true,  width: 6 },
    { kind: 'file',   key: 'asset',      label: 'Image/File', required: false, width: 6, accept: '*' },
  ];

  ngAfterViewInit(): void {
    // Подкидываем шаблоны ячеек, когда они доступны
    this.columns = this.columns.map(col => {
      if (col.key === 'price')  return { ...col, cellTemplate: this.priceTpl };
      if (col.key === 'active') return { ...col, cellTemplate: this.activeTpl };
      return col;
    });
  }

  // callback из DataTable (Output)
  onToolbar(e: { id: string; selection: Product[]; query: Query }) {
    if (e.id === 'add')    this.openCreateForm();
    if (e.id === 'export') console.log('Toolbar Output: export with query', e.query);
  }

  // ----- ОТКРЫТИЕ МОДАЛОК -----
  openCreateForm() {
    this.formTitle = 'Create Product';
    this.formConfirmLabel = 'Create';
    // сброс initial
    this.formInitial = {
      name: '',
      sku: '',
      categoryId: null,
      price: 0,
      active: true,
      createdAt: new Date().toISOString().slice(0, 10), // yyyy-mm-dd для input[type=date]
      asset: null,
    };
    // подсказать select-async стартовый id (не обяз.)
    this.formFields = this.formFields.map(f =>
      f.kind === 'select-async' ? { ...f, initialId: null } : f
    );
    this.form.show(); // открыть
  }

  openEditForm(row: Product) {
    this.formTitle = 'Edit Product';
    this.formConfirmLabel = 'Save';
    this.formInitial = {
      id: row.id,
      name: row.name,
      sku: row.sku,
      categoryId: row.categoryId,             // важн: ID для select-async
      price: row.price,
      active: row.active,
      createdAt: new Date(row.createdAt).toISOString().slice(0,10),
      asset: row.asset ?? null
    };
    // подсказать стартовый ID селекту
    this.formFields = this.formFields.map(f =>
      f.kind === 'select-async' ? { ...f, initialId: row.categoryId } : f
    );
    this.form.show();
  }

  // ----- ЗАКРЫТИЕ МОДАЛКИ -----
  onFormClosed(e: ModalResult<Record<string, any>>) {
    if (!e.confirmed) return;

    // Собираем «payload»; file/asset можешь обработать/загрузить отдельно
    const v = e.value!;
    const payload: Partial<Product> = {
      id: v['id'] ?? undefined,
      name: String(v['name'] ?? '').trim(),
      sku: String(v['sku'] ?? '').trim(),
      categoryId: v['categoryId'] ?? null, // ← строго ID
      price: Number(v['price'] ?? 0),
      active: !!v['active'],
      createdAt: v['createdAt'] ? new Date(v['createdAt']).toISOString() : new Date().toISOString(),
      // asset: v['asset // если надо, сохрани/загрузи
    };

    // Пытаемся upsert в источник, если метод есть; иначе просто перезагрузим
    const anyDs = this.ds as any;
    if (typeof anyDs.upsert === 'function') {
      anyDs.upsert(payload);
    } else if (payload.id) {
      // fallback update
      if (typeof anyDs.updateById === 'function') {
        anyDs.updateById(payload.id, payload);
      }
    } else {
      if (typeof anyDs.add === 'function') {
        anyDs.add(payload);
      }
    }

    // обновляем таблицу
    if (this.table) this.table.reload();
  }
}
