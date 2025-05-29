import {Injectable} from '@angular/core';
import {DynamicModalAbstractService} from '../../abstracts/services/dynamic-modal-abstract.service';
import {FormFieldConfig} from '../../configs/form-field.interface';
import {FolderFormFieldsConfig} from '../../constants/form-field-configs/folder-ff-configs';
import {DocumentRequest} from '../../models/document.interface';
import {DocumentModalConfig} from '../../configs/dynamic-modal-configs/document-modal-configs';

@Injectable({
  providedIn: 'root'
})
export class DocumentModalService extends DynamicModalAbstractService<DocumentRequest, Document> {
  protected override formFieldConfig: FormFieldConfig[] = DocumentModalConfig;

  override openForCreate(callback: (value: DocumentRequest) => void): void {
    const modalRef = this.openModal('Создать документ', 'create', 'Создать');
    modalRef.componentInstance.submitted.subscribe((value: DocumentRequest) => callback(value))
  }

  override openForUpdate(callback: (value: DocumentRequest) => void, initialData?: Partial<DocumentRequest>): void {
    const modalRef = this.openModal(
      'Редактировать документ',
      'update',
      'Сохранить',
      initialData
    );
    modalRef.componentInstance.submitted.subscribe((value: DocumentRequest) => callback(value));
  }

  override openForView(value: Document): void {
    throw new Error('Method not implemented.');
  }
}
