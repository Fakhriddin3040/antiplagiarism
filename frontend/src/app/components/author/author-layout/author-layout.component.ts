import {Component, inject, OnInit} from '@angular/core';
import {DynamicLayoutComponent} from '../../../dynamic-layout/dynamic-layout.component';
import {ColumnConfig} from '../../../core/configs/dynamic-layout-column.config';
import {AuthorService} from '../../../author.service';
import {AuthorModalService} from '../../../author/author-modal/author-modal.component';
import {Author} from '../../../core/models/author.interface';
import {AuthorModalConfigs} from '../../../core/configs/dynamic-modal-configs/author-modal-configs';

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
  authorModalService = inject(AuthorModalService);

  data!: Author[];
  columnConfigs: ColumnConfig[] = AuthorModalConfigs;


  ngOnInit() {
    this.setAuthors();
  }

  set _data(docs: Author[]) {
    this.data = docs;
  }

  get _data() {
    return this.data;
  }

  setAuthors() {
    return this.authorService.getAllAuthors()
      .subscribe({
        next: (docs) => this._data = docs,
        error: (error) => console.log(`Error occurred: ${error.message}`)
      })
  }

  onRowSelect(event: { row: Author, selected: boolean }) {
    console.log('Row selected:', event.row, 'Selected:', event.selected);
  }

  onRowAction(row: any) {
    console.log(`Action on app document layout. The row is: `, row);
  }

  onCreate() {
    this.authorModalService.openForCreate((docData) => {
      this.authorService.create(docData)
        .subscribe({
          next: (doc) => this._data.push(doc),
          error: (error) => console.log(`Error occurred: ${error.message}`)
        });
    })
  }

  onUpdate(row: Author) {
    console.log(`Update document with id ${row.id}`);
    this.authorModalService.openForUpdate(
      (docData) => {}
    );
  }

  onDelete(row: Author) {
    console.log(`Delete document with id ${row.id}`);
    this.authorService.delete(row.id)
      .subscribe({
        next: () => {
          this.setAuthors();
          console.log(`Document with id ${row.id} deleted successfully.`);
        },
        error: (error) => alert(`Error deleting document: ${error.message}`)
      });
  }
}
