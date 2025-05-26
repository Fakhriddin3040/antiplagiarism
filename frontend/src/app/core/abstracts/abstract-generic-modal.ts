import {
  Directive,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormFieldConfig} from '../configs/form-field.interface';

export type ModalMode = 'create' | 'update';

@Directive()
export abstract class AbstractGenericModal<T, R = T> implements OnInit {
  @Input() mode: ModalMode = 'create';

  @Input() initialData?: Partial<T>;

  @Input() titleCreate = 'Создать';
  @Input() titleUpdate = 'Изменить';
  @Input() submitLabelCreate = 'Создать';
  @Input() submitLabelUpdate = 'Сохранить';

  @Output() submitted = new EventEmitter<R>();

  protected fb = inject(FormBuilder);
  protected modal = inject(NgbActiveModal);

  abstract formFieldSchema: FormFieldConfig[];

  form!: FormGroup;

  ngOnInit(): void {
    this.buildForm();
    if (this.initialData) {
      this.form.patchValue(this.initialData);
    }
  }

  protected abstract mapFormToResult(value: any): R;

  protected beforeClose(result: R): void {}

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

    const result = this.mapFormToResult(this.form.value);
    this.beforeClose(result);
    this.submitted.emit(result);
    this.modal.close(result);
  }

  cancel(): void {
    this.modal.dismiss('cancel');
  }

  protected buildForm(): void {
    const group: Record<string, any> = {};

    for (const f of this.formFieldSchema) {
      const base = f.default ?? '';
      const validators = f.validators ?? (f.required ? [Validators.required] : []);
      group[f.key] = [base, validators];
    }

    this.form = this.fb.group(group);
  }
}
