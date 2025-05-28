import {Directive} from '@angular/core';
import {FormFieldConfig} from '../../configs/form-field.interface';
import { FormGroup } from '@angular/forms';

@Directive()
export abstract class AbstractDynamicModalService {
  abstract formFieldSchema: FormFieldConfig<any>[];
  abstract mapFormToResult(value: any): any;

  protected form = new FormGroup({});

  get isValid(): boolean {
    return this.form.valid;
  }

  get isCreate(): boolean {
    return this.modal.mode == 'create';
  }

}
