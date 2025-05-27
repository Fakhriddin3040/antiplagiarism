import {
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject, Component,
} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormFieldConfig} from '../../../core/configs/form-field.interface';
import {NgForOf, NgIf} from '@angular/common';

export type ModalMode = 'create' | 'update';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './dynamic-modal.component.html',
  styleUrl: './dynamic-modal.component.scss',
})
export class DynamicModal implements OnInit {
  @Input() mode: ModalMode = 'create';

  @Input() initialData?: Partial<any>;

  @Input() titleCreate = 'Создать';
  @Input() titleUpdate = 'Изменить';
  @Input() submitLabelCreate = 'Создать';
  @Input() submitLabelUpdate = 'Сохранить';
  @Input() formFieldSchema!: FormFieldConfig[];

  @Output() submitted = new EventEmitter<any>();
  @Output() closed = new EventEmitter<any>();

  fb = inject(FormBuilder);
  modal = inject(NgbActiveModal);


  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  get isCreate(): boolean {
    return this.mode === 'create';
  }

  get title(): string {
    return this.isCreate ? this.titleCreate : this.titleUpdate;
  }

  get submitLabel(): string {
    return this.isCreate ? this.submitLabelCreate : this.submitLabelUpdate;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const result = this.form.value;

    this.submitted.emit(result);
    this.modal.close(result)
  }

  cancel(): void {
    this.closed.emit(this.form.value);
    this.modal.dismiss('cancel');
  }

  buildForm(): void {
    const group: Record<string, any> = {};

    for (const f of this.formFieldSchema) {
      const base = f.default ?? '';
      const validators = f.validators ?? (f.required ? [Validators.required] : []);
      group[f.key] = [base, validators];
    }

    this.form = this.fb.group(group);
  }
}
