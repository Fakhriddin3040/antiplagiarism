import {Guid} from 'guid-typescript';
import {Observable} from 'rxjs';
import {Query} from '../../../components/data-table/types/table';
import {DocumentPage} from './types/document.types';

export interface DocumentServiceInterface {
  getAll(query?: Query): Observable<DocumentPage>;
  getById(): Observable<Document>;
  delete(id: Guid): Observable<void>;
  bulkDelete(ids: Guid[]): Observable<void>;
}
