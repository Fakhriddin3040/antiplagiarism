import {Component, EventEmitter, input, Output, output} from '@angular/core';

@Component({
  selector: 'app-secondary-button',
  imports: [],
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss'
})
export class SecondaryButtonComponent {
  label = input<string>('Ok');
  disabled = input<boolean>();
  @Output() clicked = new EventEmitter<void>();
}
