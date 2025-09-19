import {CreateFolderDto, Folder, UpdateFolderDto} from './types/folder.types';
import {Observable} from 'rxjs';
import {Guid} from 'guid-typescript';

export interface FolderServiceInterface {
  getRoots(): Observable<Folder[]>;
  getChildren(id: Guid): Observable<Folder[]>;
  rename(id: Guid, newTitle: string): Observable<void>;
  create(item: CreateFolderDto): Observable<Folder>;
  update(id: Guid, item: UpdateFolderDto): Observable<void>;
  delete(id: Guid): Observable<void>;
}
