// dynamic-layout.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import {ColumnConfig} from '../core/configs/dynamic-layout-column.config';
import {NgForOf} from '@angular/common';
import {RowComponent} from '../components/dynamic-layout/dynamic-row/dynamic-row.component';
import {AngularSvgIconModule, SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  templateUrl: './dynamic-layout.component.html',
  styleUrls: ['./dynamic-layout.component.scss'],
  imports: [
    NgForOf,
    RowComponent,
    SvgIconComponent,
    AngularSvgIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicLayoutComponent {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Output() rowSelected = new EventEmitter<{ row: any, selected: boolean }>();
  @Output() rowAction = new EventEmitter<any>();

  // Обработчики событий от RowComponent:
  onRowSelect(event: { row: any, selected: boolean }) {
    this.rowSelected.emit(event);
  }
  onRowAction(row: any) {
    this.rowAction.emit(row);
  }

  onToggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.data.forEach(row => {
      this.onRowSelect({row: row, selected: checked});
    })
  }
}
