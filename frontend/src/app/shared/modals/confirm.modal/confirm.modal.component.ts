import {
  Component,
  EventEmitter,
  Output,
  input,
  ViewChild,
  ElementRef,
  HostListener,
  AfterViewInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryButtonComponent } from '../../secondary-button/secondary-button.component';
import { PrimaryButtonComponent, PrimaryButtonVariant } from '../../primary-button/primary-button.component';
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  standalone: true,
  selector: 'app-confirm',
  imports: [CommonModule, SecondaryButtonComponent, PrimaryButtonComponent, A11yModule],
  templateUrl: './confirm.modal.component.html',
  styleUrls: ['./confirm.modal.component.scss'],
  host: {
    class: 'confirm-host',
    tabindex: '0',
    '(keydown.escape)': 'emit(false)',
  },
})
export class ConfirmModalComponent implements AfterViewInit {
  // сигнальные инпуты
  readonly title = input('Подтвердите действие');
  readonly message = input('Вы уверены?');
  readonly confirmLabel = input('Подтвердить');
  readonly discardLabel = input('Отменить');
  readonly primaryButtonVariant = input<PrimaryButtonVariant>('primary');
  readonly backdropClose = input(true);

  @Output() closed = new EventEmitter<boolean>();

  @ViewChild('okBtn', { read: ElementRef }) okBtn?: ElementRef<HTMLButtonElement>;
  ngAfterViewInit(){ this.okBtn?.nativeElement?.focus(); }
  @HostListener('keydown.enter') onEnter(){ this.emit(true); }

  emit(v: boolean) { this.closed.emit(v); }
  onBackdrop() { if (this.backdropClose()) this.emit(false); }
}
