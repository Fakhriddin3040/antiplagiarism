// dynamic-layout.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ColumnConfig } from '../core/configs/dynamic-layout-column.config';
import {DatePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

@Component({
  selector: 'app-dynamic-layout',
  templateUrl: './dynamic-layout.component.html',
  styleUrls: ['./dynamic-layout.component.scss'],
  imports: [
    NgForOf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    NgIf,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicLayoutComponent {
  @Input() columns: ColumnConfig[] = [];
  @Input() data: any[] = [];
  @Output() rowSelected = new EventEmitter<{ row: any, selected: boolean }>();
  @Output() rowAction = new EventEmitter<{ row: any, action: string }>();

  menuActions = [
    { label: 'Edit', value: 'edit' },
    { label: 'Delete', value: 'delete' },
    { label: 'Clone', value: 'clone' }
  ];

  toggleRowSelect(row: any, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    row.selected = checked;
    this.rowSelected.emit({ row, selected: checked });
  }

  onToggleAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.data.forEach(row => {
      row.selected = checked;
      this.rowSelected.emit({ row, selected: checked });
    });
  }

  isAllSelected(): boolean {
    return this.data.length > 0 && this.data.every(row => row.selected);
  }

  toggleMenu(row: any): void {
    this.data.forEach(r => {
      if (r !== row) r.showMenu = false;
    });
    row.showMenu = !row.showMenu;
  }

  handleMenuAction(row: any, action: { value: string }): void {
    row.showMenu = false;
    this.rowAction.emit({ row, action: action.value });
  }
}
