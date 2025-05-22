import {Component, Input, SimpleChanges} from '@angular/core';
import {DocumentService} from '../../core/services/document-service';
import {Document} from '../../core/interfaces/document-interface';
import {Folder} from '../../core/interfaces/folder-interface';

@Component({
  selector: 'app-document-list',
  imports: [],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.scss'
})
export class DocumentListComponent {
// document-list.component.ts (упрощенно)
  @Input() folder: Folder;

  documents: Document[] = [];
  filterQuery: string = '';

  constructor(private documentService: DocumentService) {}
  constructor(private dialog: MatDialog, /* другие зависимости */) {}

  openAddDocument(): void {
    const dialogRef = this.dialog.open(DocumentFormComponent, {
      width: '500px',
      data: { folderId: this.folder.id }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // если документ успешно создан (result может быть новым документом)
        this.loadDocuments();
      }
    });


    ngOnChanges(changes: SimpleChanges) {
    if (changes['folder'] && this.folder) {
      // при смене папки загружаем документы
      this.loadDocuments();
    }
  }

  loadDocuments(): void {
    this.documentService.getDocuments(this.folder.id).subscribe(docs => {
      this.documents = docs;
    });
  }

  onSearch(): void {
    // Поиск документов внутри папки (можно фильтровать локально или запросом)
    const q = this.filterQuery.trim();
    if (q) {
      this.documents = this.documents.filter(doc => doc.title.toLowerCase().includes(q.toLowerCase()));
    } else {
      this.loadDocuments(); // если запрос пустой, перезагрузить полный список
    }
  }
}
