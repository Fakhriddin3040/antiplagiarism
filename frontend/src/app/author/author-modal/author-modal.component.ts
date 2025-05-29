import {Injectable} from '@angular/core';
import {FormFieldConfig} from '../../core/configs/form-field.interface';
import { DynamicModalAbstractService } from '../../core/abstracts/services/dynamic-modal-abstract.service';
import {Author, AuthorRequest} from '../../core/models/author.interface';
import {AuthorModalConfigs} from '../../core/configs/dynamic-modal-configs/author-modal-configs';

@Injectable({
  providedIn: 'root'
})
export class AuthorModalService extends DynamicModalAbstractService<AuthorRequest, Author> {
  protected override formFieldConfig: FormFieldConfig[] = AuthorModalConfigs;

  override openForCreate(callback: (value: AuthorRequest) => void): void {
    const modalRef = this.openModal('Создать автора', 'create', 'Создать');
    modalRef.componentInstance.submitted.subscribe((value: AuthorRequest) => callback(value))
  }

  override openForUpdate(callback: (value: AuthorRequest) => void, initialData?: Partial<AuthorRequest>): void {
    const modalRef = this.openModal(
      'Редактировать автора',
      'update',
      'Сохранить',
      initialData
    );
    modalRef.componentInstance.submitted.subscribe((value: AuthorRequest) => callback(value));
  }

  override openForView(value: Author): void {
    throw new Error('Method not implemented.');
  }
}
