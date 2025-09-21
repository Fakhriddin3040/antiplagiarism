import { Guid } from "guid-typescript";
import {Observable} from 'rxjs';
import {Author, AuthorsPage, CreateAuthorDto, UpdateAuthorDto} from './types/author.types';
import {Query} from '../../../components/data-table/types/table';

export interface AuthorServiceInterface {
  getAll(query?: Query): Observable<AuthorsPage>;
  create(item: CreateAuthorDto): Observable<Author>;
  update(id: Guid, item: UpdateAuthorDto): Observable<void>;
  delete(id: Guid): Observable<void>;
  bulkDelete(ids: Guid[]): undefined;
}
