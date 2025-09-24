import {DocumentDataSourceInterface} from '../../core/features/document/document.data-source.interface';
import {Observable} from 'rxjs';
import {Page, Query} from '../../components/data-table/types/table';
import {Document} from '../../core/features/document/types/document.types';
import {inject} from '@angular/core';
import {DOCUMENT_SERVICE} from '../../core/features/document/document.tokens';

export class DocumentDataSource implements DocumentDataSourceInterface {
  private documentService = inject(DOCUMENT_SERVICE);
  fetch(q: Query): Observable<Page<Document>> {
    return this.documentService.getAll(q)
  }
}
