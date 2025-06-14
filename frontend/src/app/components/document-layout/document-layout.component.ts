import {AngularSvgIconModule, SvgIconComponent, SvgIconRegistryService} from 'angular-svg-icon';
import {Component, inject, OnInit} from '@angular/core';
import {Document} from '../../core/models/document.interface';
import {DocumentService} from '../../core/services/document.service';
import {DynamicLayoutComponent} from '../../dynamic-layout/dynamic-layout.component';
import {ColumnConfig} from '../../core/configs/dynamic-layout-column.config';
import {DocumentDlcConfig} from '../../core/constants/dynamic-layout-column/document.dlc.config';
import {DocumentModalService} from '../../core/services/modal-services/document-modal.service';

@Component({
  selector: 'app-document-layout',
  standalone: true,
  imports: [
    DynamicLayoutComponent,
    AngularSvgIconModule,
    SvgIconComponent
  ],
  templateUrl: './document-layout.component.html',
  styleUrl: './document-layout.component.scss'
})
export class DocumentLayoutComponent implements OnInit {
  documentService = inject(DocumentService);
  documentModalService = inject(DocumentModalService);

  data!: Document[];
  columnConfigs: ColumnConfig[] = DocumentDlcConfig;


  ngOnInit() {
    this.setDocuments();
  }

  set _data(docs: Document[]) {
    this.data = docs;
  }

  setDocuments() {
    return this.documentService.getAllDocuments()
      .subscribe({
        next: (docs) => this._data = docs,
        error: (error) => console.log(`Error occurred: ${error.message}`)
      })
  }

  onRowSelect(event: { row: Document, selected: boolean }) {
    // Здесь можно обработать выбор строки, если нужно
    console.log('Row selected:', event.row, 'Selected:', event.selected);
  }

  onRowAction(row: any) {
    console.log(`Action on app document layout. The row is: `, row);
  }

  onCreate() {
    this.documentModalService.openForCreate((doc) => {
      console.log(`Document created with id ${doc.title}`);
      this.documentService.getAllDocuments();
    });
  }

  onUpdate(row: Document) {
    console.log(`Update document with id ${row.id}`);
  }

  onDelete(row: Document) {
    console.log(`Delete document with id ${row.id}`);
  }
}
