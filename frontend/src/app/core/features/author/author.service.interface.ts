import { Guid } from "guid-typescript";
import {Observable} from 'rxjs';
import {Author, CreateAuthorDto, UpdateAuthorDto} from './types/author.types';

export interface AuthorServiceInterface {
  getAll(): Observable<Author[]>;
  getById(id: Guid): Observable<Author>;
  create(item: CreateAuthorDto): Observable<Author>;
  update(id: Guid, item: UpdateAuthorDto): Observable<void>;
  delete(id: Guid): Observable<void>;
}
