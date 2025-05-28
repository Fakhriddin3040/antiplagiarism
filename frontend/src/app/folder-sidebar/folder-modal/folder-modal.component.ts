import { Component } from '@angular/core';
import {AbstractGenericModal} from '../../core/abstracts/abstract-generic-modal';
import {Folder, FolderRequest} from '../../core/models/folder.interface';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {FormFieldConfig} from '../../core/configs/form-field.interface';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {NgForOf, NgSwitch, NgSwitchCase} from '@angular/common';
import {Observable} from 'rxjs';
import {FileDropComponent} from '../../core/file-drop/file-drop.component';
import {FolderFormFieldsConfig} from '../../core/constants/form-field-configs/folder-ff-configs';

@Component({
  selector: 'app-folder-modal',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    NgSwitchCase,
    FileDropComponent,
    NgSwitch
  ],
  templateUrl: './folder-modal.component.html',
  styleUrl: './folder-modal.component.scss'
})
export class FolderModalComponent extends AbstractGenericModal<FolderRequest> {
  override formFieldSchema: FormFieldConfig<FolderRequest>[] = FolderFormFieldsConfig;

  override mapFormToResult(value: FolderRequest): FolderRequest {
    return value;
  }
}
