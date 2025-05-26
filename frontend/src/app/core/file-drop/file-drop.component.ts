import {
  Component,
  forwardRef,
  Input,
  ChangeDetectionStrategy,
  HostBinding,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

@Component({
  selector: 'app-file-drop',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileDropComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="drop-zone"
      [class.dragover]="dragOver"
      (dragover)="onDragOver($event)"
      (dragleave)="dragOver = false"
      (drop)="onDrop($event)"
      (click)="fileInput.click()">

      <ng-content></ng-content>
      <input
        type="file"
        [accept]="accept"
        hidden
        #fileInput
        (change)="onSelect($event)" />
    </div>
  `,
  styles: [`
    .drop-zone {
      border: 2px dashed #90caf9;
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }
    .drop-zone.dragover { background: #e3f2fd; }
    :host[disabled]      { opacity: .4; pointer-events: none; }
  `],
})
export class FileDropComponent implements ControlValueAccessor {

  @Input() accept = '*/*';

  dragOver = false;
  private _disabled = false;

  private onChange: (value: File | null) => void = () => {};
  private onTouched: () => void = () => {};

  onDragOver(e: DragEvent) {
    if (this._disabled) return;
    e.preventDefault();
    this.dragOver = true;
  }

  onDrop(e: DragEvent) {
    if (this._disabled) return;
    e.preventDefault();
    this.dragOver = false;
    const file = e.dataTransfer?.files?.[0] ?? null;
    this.emitFile(file);
  }

  onSelect(e: Event) {
    if (this._disabled) return;
    const file = (e.target as HTMLInputElement).files?.[0] ?? null;
    this.emitFile(file);
  }

  writeValue(_: File | null): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this._disabled = disabled;
  }

  private emitFile(file: File | null) {
    this.onChange(file);
    this.onTouched();
  }
}
