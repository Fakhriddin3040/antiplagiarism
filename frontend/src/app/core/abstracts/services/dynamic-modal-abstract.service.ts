import {Directive, inject, Injectable, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormFieldConfig} from '../../configs/form-field.interface';
import {DynamicModal} from '../../../shared/components/dynamic-modal/dynamic-modal.component';

@Directive()
export abstract class DynamicModalAbstractService<T> {
  protected modal = inject(NgbModal);

  protected abstract formFieldConfig: FormFieldConfig[];

  protected openModal(
    modalTitle: string,
    mode: 'create' | 'update',
    submitLabelTitle?: string,
    initialData?: Partial<T>,
  ): NgbModalRef {
    const modalRef = this.modal.open(DynamicModal<T>, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
      windowClass: 'modal-xl'
    });

    let modalInstanceTitleProp: keyof DynamicModal<T>;

    if (mode === 'create') modalInstanceTitleProp = 'titleCreate';
    else modalInstanceTitleProp = 'titleUpdate';

    modalRef.componentInstance.formFieldSchema = this.formFieldConfig;
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.initialData = initialData;
    modalRef.componentInstance[modalInstanceTitleProp] = modalTitle;

    modalRef.componentInstance.submitLabelCreate = submitLabelTitle;

    return modalRef;
  }

  abstract openForCreate(callback: (value: T) => void): void;
  abstract openForUpdate(callback: (value: T) => void, initialData: Partial<T>): void;
  abstract openForView(value: T): void;
}
