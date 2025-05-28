import {Injectable} from '@angular/core';
import {FormFieldConfig} from '../../configs/form-field.interface';
import {Folder, FolderRequest} from '../../models/folder.interface';
import {FolderFormFieldsConfig} from '../../constants/form-field-configs/folder-ff-configs';
import {DynamicModalAbstractService} from '../../abstracts/services/dynamic-modal-abstract.service';

@Injectable({
  providedIn: 'root'
})
export class FolderModalService extends DynamicModalAbstractService<FolderRequest> {
  // @ts-ignore
  protected override formFieldConfig: FormFieldConfig[] = FolderFormFieldsConfig;

  override openForCreate(callback: (value: FolderRequest) => void): void {
    const modalRef = this.openModal('Создать директорию', 'create', 'Создать');
    modalRef.componentInstance.submitted.subscribe((value: FolderRequest) => callback(value))
  }

  override openForUpdate(callback: (value: FolderRequest) => void, initialData: Partial<FolderRequest>): void {
    const modalRef = this.openModal(
      'Редактировать директорию',
      'update',
      'Сохранить',
      initialData
    );
    modalRef.componentInstance.submitted.subscribe((value: FolderRequest) => callback(value));
  }

  override openForView(value: Folder): void {
    throw new Error('Method not implemented.');
  }
}
