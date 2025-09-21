import {Component, EventEmitter, input, Output} from '@angular/core';


export type PrimaryButtonVariant = 'primary' | 'danger';


@Component({
  selector: 'app-primary-button',
  imports: [],
  templateUrl: './primary-button.component.html',
  styleUrl: './primary-button.component.scss'
})
export class PrimaryButtonComponent {
  label = input<string>('Ok');
  disabled = input<boolean>(false);
  variant = input<PrimaryButtonVariant>('primary');

  @Output() clicked = new EventEmitter<void>();
}
