import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {FormFieldConfig} from '../../../core/configs/form-field.interface';


@Component({
  selector: 'app-generic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class DynamicModal<T> implements OnInit {
  @Input() mode: 'create' | 'update' = 'create';
  @Input() initialData?: Partial<T>;
  @Input() titleCreate!: string;
  @Input() titleUpdate!: string;
  @Input() submitLabelCreate: string = 'Создать';
  @Input() submitLabelUpdate: string = 'Сохранить';
  @Input() formFieldSchema: FormFieldConfig<T>[] = [];

  @Output() submitted = new EventEmitter<T>();

  form!: FormGroup;

  constructor(public modal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    const group: { [key: string]: any } = {};

    for (let field of this.formFieldSchema) {
      let value: any = null;
      if (this.initialData && (this.initialData as any)[field.key] !== undefined) {
        value = (this.initialData as any)[field.key];
      } else if (field.default !== undefined) {
        value = field.default;
      } else {
        switch (field.type) {
          case 'checkbox':
            value = false;
            break;
          case 'array-dnd':
            value = [];
            break;
          default:
            value = '';
        }
      }

      const validators = field.validators ? [...field.validators] : [];
      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'array-dnd') {
        const arr = this.fb.array([]);
        if (Array.isArray(value) && value.length) {
          for (let item of value) {
            arr.push(this.fb.control(item, validators));
          }
        } else {
          arr.push(this.fb.control('', validators));
        }
        group[field.key] = arr;
      } else {
        group[field.key] = this.fb.control(value, validators);
      }
    }

    this.form = this.fb.group(group);
  }

  get isCreate(): boolean {
    return this.mode === 'create';
  }

  onSubmit() {
    if (this.form.valid) {
      const result = this.form.value as T;
      this.modal.close(result);
      this.submitted.emit(result);
    }
  }

  onCancel() {
    this.modal.dismiss();
  }

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(key)?.setValue(file);
    }
  }

  addArrayItem(key: string) {
    const control = this.form.get(key) as FormArray;
    control.push(this.fb.control(''));
  }

  removeArrayItem(key: string, index: number) {
    const control = this.form.get(key) as FormArray;
    control.removeAt(index);
  }
}
