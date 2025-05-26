// dynamic-form-modal.component.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

export interface FieldConfig {
  key: string;        // имя поля (ключ для FormControl и для результата)
  label: string;      // метка (отображаемое название поля)
  type: string;       // тип поля: 'text', 'email', 'textarea', 'number' и т.д.
  required: boolean; // обязательное поле или нет
}

@Component({
  selector: 'app-dynamic-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgbModalModule],
  templateUrl: './dynamic-form-modal.component.html'
})
export class DynamicFormModalComponent implements OnInit {
  @Input() title: string = '';              // Заголовок модального окна
  @Input() fields: FieldConfig[] = [];      // Конфигурация полей формы

  form: FormGroup = new FormGroup({});      // Реактивная форма, наполняется динамически
  activeModal = inject(NgbActiveModal);     // Сервис для управления модалкой (close/dismiss)

  ngOnInit(): void {
    for (const field of this.fields) {
      const control = new FormControl('');
      if (field.required) {
        control.addValidators(Validators.required);
      }
      this.form.addControl(field.key, control);
    }
  }

  // Обработка отправки формы: закрыть модалку и вернуть значения полей
  submit(): void {
    if (this.form.valid) {
      this.activeModal.close(this.form.value);
    }
  }
}
