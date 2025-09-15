import {
  Component, Input, Output, EventEmitter, TemplateRef, signal, computed
} from '@angular/core';
import {NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-ultimate-modal',
  standalone: true,
  templateUrl: "ultimate-modal.component.html",
  imports: [
    NgTemplateOutlet
  ],
  styleUrls: ['./ultimate-modal.component.scss']
})
export class UltimateModalComponent<T = any> {
  /** Управление */
  open = signal(false);

  /** Контент */
  @Input() title = 'Модалка';
  @Input() message = '';
  @Input() contentTpl?: TemplateRef<any>;
  @Input() data?: T;

  /** Подтверждение */
  @Input() confirmMode = false;
  @Input() confirmLabel = 'Подтвердить';

  /** Выход */
  @Output() closed = new EventEmitter<{ confirmed: boolean, data?: T }>();

  show(data?: T) {
    this.data = data;
    this.open.set(true);
  }

  close(confirmed: boolean) {
    this.open.set(false);
    this.closed.emit({ confirmed, data: this.data });
  }
}
