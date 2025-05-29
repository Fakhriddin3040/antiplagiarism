import {Directive, inject} from '@angular/core';
import {FormFieldConfig} from '../../configs/form-field.interface';
import {DynamicModal} from '../../../shared/components/dynamic-modal/dynamic-modal.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Directive()
export abstract class DynamicModalAbstractService<T, R = T> {
  private dialog = inject(MatDialog);


  protected abstract formFieldConfig: FormFieldConfig[];

  protected openModal(
    modalTitle: string,
    mode: 'create' | 'update',
    submitLabelTitle?: string,
    initialData?: Partial<T>,
  ): MatDialogRef<DynamicModal<T>> {
    let modalInstanceTitleProp: keyof DynamicModal<T>['data'];

    if (mode === 'create') modalInstanceTitleProp = 'titleCreate';
    else modalInstanceTitleProp = 'titleUpdate';

    return this.dialog.open(DynamicModal<T>, {
      width: '400px',
      disableClose: true,
      data: {
        mode: mode,
        formFieldSchema: this.formFieldConfig,
        initialData: initialData,
        [modalInstanceTitleProp]: modalTitle,
        submitLabelCreate: submitLabelTitle || 'Создать',
      }
    });
  }

  abstract openForCreate(callback: (value: T) => void): void;
  abstract openForUpdate(callback: (value: T) => void, initialData: Partial<T>): void;
  abstract openForView(value: R): void;
}
