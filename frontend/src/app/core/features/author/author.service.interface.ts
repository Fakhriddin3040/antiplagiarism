import {Observable} from 'rxjs';
import {
  Author,
  AuthorsPage,
  CreateAuthorDto,
  ShortAuthorPage,
  UpdateAuthorDto
} from './types/author.types';
import {Query} from '../../../components/data-table/types/table';

export interface AuthorServiceInterface {
  getAll(query?: Query): Observable<AuthorsPage>;
  shortList(query?: Query): Observable<ShortAuthorPage>;
  create(item: CreateAuthorDto): Observable<Author>;
  update(id: string, item: UpdateAuthorDto): Observable<void>;
  delete(id: string): Observable<void>;
  bulkDelete(ids: string[]): undefined;
}
