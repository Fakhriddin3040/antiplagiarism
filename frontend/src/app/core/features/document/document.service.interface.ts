import {Observable} from 'rxjs';
import {Query} from '../../../components/data-table/types/table';
import {CreateDocumentDto, Document, DocumentPage} from './types/document.types';

export interface DocumentServiceInterface {
  getAll(query?: Query): Observable<DocumentPage>;
  getById(): Observable<Document>;
  create(data: CreateDocumentDto): Observable<Document>;
  delete(id: string): Observable<void>;
  bulkDelete(ids: string[]): Observable<void>;
}
