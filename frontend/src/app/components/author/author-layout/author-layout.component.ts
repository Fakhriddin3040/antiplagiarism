import {Component, inject, OnInit} from '@angular/core';
import {DynamicLayoutComponent} from '../../../dynamic-layout/dynamic-layout.component';
import {DocumentService} from '../../../core/services/document.service';
import {DocumentModalService} from '../../../core/services/modal-services/document-modal.service';
import {Document} from '../../../core/models/document.interface';
import {ColumnConfig} from '../../../core/configs/dynamic-layout-column.config';
import {DocumentDlcConfig} from '../../../core/constants/dynamic-layout-column/document.dlc.config';
import {AuthorService} from '../../../author.service';
import {AuthorModalService} from '../../../author/author-modal/author-modal.component';

@Component({
  selector: 'app-author-layout',
  imports: [
    DynamicLayoutComponent
  ],
  templateUrl: './author-layout.component.html',
  styleUrl: './author-layout.component.scss'
})
export class AuthorLayoutComponent implements OnInit {
  authorService = inject(AuthorService);
  documentModalService = inject(AuthorModalService);

  data!: Document[];
  columnConfigs: ColumnConfig[] = DocumentDlcConfig;


  ngOnInit() {
    this.setDocuments();
  }

  set _data(docs: Document[]) {
    this.data = docs;
  }

  get _data() {
    return this.data;
  }

  setDocuments() {
    return this.documentService.getAllDocuments()
      .subscribe({
        next: (docs) => this._data = docs,
        error: (error) => console.log(`Error occurred: ${error.message}`)
      })
  }

  onRowSelect(event: { row: Document, selected: boolean }) {
    console.log('Row selected:', event.row, 'Selected:', event.selected);
  }

  onRowAction(row: any) {
    console.log(`Action on app document layout. The row is: `, row);
  }

  onCreate() {
    this.documentModalService.openForCreate((docData) => {
      this.documentService.create(docData)
        .subscribe({
          next: (doc) => this._data.push(doc),
          error: (error) => console.log(`Error occurred: ${error.message}`)
        });
    })
  }

  onUpdate(row: Document) {
    console.log(`Update document with id ${row.id}`);
    this.documentModalService.openForUpdate(
      (docData) => {}
    );
  }

  onDelete(row: Document) {
    console.log(`Delete document with id ${row.id}`);
    this.documentService.delete(row.id)
      .subscribe({
        next: () => {
          this.setDocuments();
          console.log(`Document with id ${row.id} deleted successfully.`);
        },
        error: (error) => alert(`Error deleting document: ${error.message}`)
      });
  }
}
