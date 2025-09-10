import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';
import {AppDataTableComponent} from '../../data-table.component';
import {makeProducts, Product, ProductDataSource} from '../data-sources/product-data-table-source';
import {ActionDef, ColumnDef, FilterDef} from '../../types/table';

@Component({
  selector: 'app-demo-products',
  standalone: true,
  imports: [AppDataTableComponent, NgClass, AppDataTableComponent, DecimalPipe],
  template: `
    <app-data-table
      [columns]="columns"
      [filters]="filters"
      [actions]="actions"
      [dataSource]="dataSource">
    </app-data-table>

    <!-- Кастомная ячейка цены -->
    <ng-template #priceTpl let-row>
      <span class="price-cell">{{ row.price | number:'1.2-2' }}</span>
    </ng-template>

    <!-- Кастомная ячейка статуса -->
    <ng-template #activeTpl let-row>
      <span class="badge" [ngClass]="row.active ? 'on' : 'off'">
        {{ row.active ? 'Active' : 'Inactive' }}
      </span>
    </ng-template>
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

  // мок-источник
  private ds = new ProductDataSource(makeProducts(120));
  dataSource = { fetch: this.ds.fetch.bind(this.ds) };

  // Конфиги (ячейки с шаблонами будем присвоить после ViewInit)
  columns: ColumnDef<Product>[] = [
    { key: 'name',      header: 'Name',      sortable: true },
    { key: 'sku',       header: 'SKU',       sortable: true },
    { key: 'category',  header: 'Category',  sortable: true },
    { key: 'price',     header: 'Price',     sortable: true, cellTemplate: null },
    { key: 'active',    header: 'Status',    sortable: false, cellTemplate: null },
    { key: 'createdAt', header: 'Created',   sortable: true,
      accessor: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  filters: FilterDef<Product>[] = [
    {
      field: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Tech',    value: 'Tech'    },
        { label: 'Clothes', value: 'Clothes' },
        { label: 'Food',    value: 'Food'    },
      ],
      placeholder: 'All categories',
    },
    {
      field: 'active',
      label: 'Only active',
      type: 'bool',
      // если хочешь тристейт — сделай кастомный toQuery и отдельный UI
    },
    {
      field: 'createdAt',
      label: 'Created At',
      type: 'dateRange',
      // onFilterRangeChange положит createdAt_from / createdAt_to
    },
    // пример текстового фильтра по SKU (под «like»)
    {
      field: 'sku',
      label: 'SKU',
      type: 'text',
      toQuery: (v: string) => v?.trim() ? ({ sku: v.trim() }) : ({})
    },
    // если нужен диапазон цен — в шаблоне добавь case 'numberRange' и используй поле 'price'
    // {
    //   field: 'price',
    //   label: 'Price',
    //   type: 'numberRange',
    // }
  ];

  actions: ActionDef<Product>[] = [
    // toolbar
    {
      id: 'add',
      label: 'Add Product',
      scope: 'toolbar',
      run: async ({ reload }) => {
        alert('Pretend to add product');
        reload();
      }
    },
    // bulk
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
    // row actions
    {
      id: 'view',
      label: 'View',
      scope: 'row',
      run: async ({ row }) => alert(`Viewing ${row?.name}`)
    },
    {
      id: 'delete',
      label: 'Delete',
      scope: 'row',
      requiresConfirm: true,
      run: async ({ row, reload }) => {
        if (!row) return;
        this.ds.removeByIds([row.id]);
        reload();
      }
    }
  ];

  ngAfterViewInit(): void {
    // Подкидываем шаблоны ячеек после того как они существуют
    // (TemplateRef доступен только после инициализации вьюхи)
    this.columns = this.columns.map(col => {
      if (col.key === 'price')  return { ...col, cellTemplate: this.priceTpl };
      if (col.key === 'active') return { ...col, cellTemplate: this.activeTpl };
      return col;
    });
  }
}
