import {Component, effect, inject, Input, OnInit, signal} from '@angular/core';
import {ApiQueryParam, ModelConfig} from '../../core/types/datagrid';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {NgForOf, NgIf, NgSwitch, NgSwitchCase} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-data-grid',
  imports: [
    MatDatepickerToggle,
    MatDatepicker,
    MatTable,
    NgForOf,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatButton,
    MatInput,
    MatDatepickerInput,
    ReactiveFormsModule,
    NgIf,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
    MatProgressBar,
    MatLabel,
    NgSwitchCase,
    MatSelect,
    NgSwitch,
    MatFormField,
    MatOption,
  ],
  templateUrl: './data-grid.component.html',
  styleUrl: './data-grid.component.scss'
})
export class DataGridComponent<T> implements OnInit {
  @Input({required: true}) config!: ModelConfig<T>;

  private fb = inject(FormBuilder);

  rows = signal<T[]>([]);
  total = signal<number>(0);
  loading = signal<boolean>(false);

  limit = signal<number>(10);
  offset = signal<number>(0);
  sort = signal<{field: string, direction: 'asc' | 'desc'} | null>(null);

  filterForm = this.fb.group({});

  ngOnInit() {
    const controls: Record<string, any> = {};

    for (const f of this.config.filters) {
      controls[`${f.key}__op`] = [f.defaultOperator ?? f.operators[0]];
      controls[`${f.key}__value`] = [null];

      if (f.type === 'daterange') {
        controls[`${f.key}__value2`] = [null];
      }
    }
    this.filterForm = this.fb.group(controls);

    effect(() => {
      const _ = this.filterForm.value;
      const s = this.sort();
      const l = this.limit();
      const o = this.offset();

      this.fetch();
    });
  }

  private async fetch() {
    this.loading.set(true);
    const filters: ApiQueryParam[] = this.buildFilterParams();
    const sort = this.sort();
    const query = this.config.api.buildQuery(filters, sort ?? undefined, this.limit(), this.offset());
    this.config.api.list(query).subscribe(
      data => {
        this.rows.set(data.data);
        this.total.set(data.total);
      },
      error => {
        console.error('Error fetching data:', error);
      },
      () => {
        this.loading.set(false);
      }
    );

  }

  private buildFilterParams(): ApiQueryParam[] {
    const filters: ApiQueryParam[] = [];
    const raw = this.filterForm.getRawValue();

    for (const def of this.config.filters) {
      const operator = raw[`${def.key}__op`];
      const v1 = raw[`${def.key}__value`];
      const v2 = raw[`${def.key}__value2`];

      // пропускаем пустые
      if ((operator === 'isnull' || operator === 'notnull') || (v1 !== null && v1 !== '' && v1 !== undefined)) {
        if (operator === 'between' || operator === 'daterange') {
          if (v1 && v2) filters.push({ field: def.key, operator, value: [v1, v2] });
        } else if (operator === 'isnull' || operator === 'notnull') {
          filters.push({ field: def.key, operator });
        } else {
          filters.push({ field: def.key, operator, value: v1 });
        }
      }
    }
    return filters;
  }

  onSort(field: string) {
    const cur = this.sort();
    const direction = !cur || cur.field !== field ? 'asc' : (cur.direction === 'asc' ? 'desc' : 'asc');
    this.sort.set({field, direction});
  }

  onLimitChange(newLimit: number) { this.limit.set(newLimit); }
  onOffsetChange(newOffset: number) { this.offset.set(newOffset); }

  async openCreateModal() {}
  async openUpdateModal() {}
  async deleteModal() {}
}
