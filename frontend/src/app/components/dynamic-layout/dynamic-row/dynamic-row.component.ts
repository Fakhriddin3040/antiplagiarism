// row.component.ts

import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from "@angular/core";
import {ColumnConfig} from '../../../core/configs/dynamic-layout-column.config';
import {DatePipe, NgForOf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';

@Component({
  selector: 'app-row',
  standalone: true,
  templateUrl: './dynamic-row.component.html',
  styleUrls: ['./dynamic-row.component.scss'],
  imports: [
    NgSwitch,
    NgForOf,
    NgSwitchCase,
    NgSwitchDefault,
    DatePipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowComponent {
  @Input() columns: ColumnConfig[] = [];
  @Input() row: any;
  @Output() select = new EventEmitter<{ row: any, selected: boolean }>();
  @Output() action = new EventEmitter<any>();

  isSelected: boolean = false;

  toggleSelect() {
    this.isSelected = !this.isSelected;
    this.select.emit({ row: this.row, selected: this.isSelected });
  }

  triggerAction() {
    this.action.emit(this.row);
  }
}
