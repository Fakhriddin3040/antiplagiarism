import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Category, ProductDataSource} from './data-sources/product-data-table-source';
import {ModalFieldDef} from '../../../core/types/form-types';
import {FormModalService} from '../../../core/services/form-modal.service';

@Component({
  standalone: true,
  selector: 'app-demo-usage',
  imports: [CommonModule],
  template: `<button class="btn btn-primary" (click)="openCreate()">Create product</button>`
})
export class DemoUsageComponent {
  private ds = new ProductDataSource([]); // только для примера, у тебя уже есть свой

  constructor(private modals: FormModalService) {}

  async openCreate() {
    const fields: ModalFieldDef[] = [
      { key: 'name', label: 'Name', kind: 'text', required: true, placeholder: 'Product name', width: 12 },
      { key: 'sku',  label: 'SKU',  kind: 'text', required: true, placeholder: 'e.g. SKU-0001', width: 6 },
      {
        key: 'categoryId',
        label: 'Category',
        kind: 'select-async',
        placeholder: 'Select category',
        width: 6,
        load: this.ds.searchCategories,               // (term) => Observable<Category[]>
        labelOf: (c: Category) => c.name,
        idOf: (c: Category) => c.id,
        initialId: null
      },
      { key: 'active', label: 'Active', kind: 'checkbox', hint: 'Is visible in catalog?' },
      { key: 'desc',   label: 'Description', kind: 'textarea', rows: 4, width: 12 },
      { key: 'files',  label: 'Images', kind: 'file', multiple: true, accept: 'image/*', width: 12 },
    ];

    const res = await this.modals.open({
      title: 'Create product',
      confirmLabel: 'Create',
      fields,
      initialValue: { active: true },
      requireConfirm: true,
    });

    if (res.confirmed) {
      console.log('Form value:', res.value);
      // тут делаешь вызов API на создание
    }
  }
}
