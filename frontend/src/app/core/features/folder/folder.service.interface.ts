import {CreateFolderDto, Folder, UpdateFolderDto} from './types/folder.types';
import {Observable} from 'rxjs';
import {Guid} from 'guid-typescript';

export interface FolderServiceInterface {
  getRoots(): Observable<Folder[]>;
  getAll(): Observable<Folder[]>;
  getChildren(id: Guid): Observable<Folder[]>;
  create(item: CreateFolderDto): Observable<Folder>;
  update(id: Guid, item: UpdateFolderDto): Observable<void>;
  delete(id: Guid): Observable<void>;
  getTree(
    opts?: { sort?: (a: Folder, b: Folder) => number }
  ): Observable<Folder[]>;
  buildTree(
    folders: Folder[],
    opts?: { sort?: (a: Folder, b: Folder) => number }
  ): Folder[];
}
