import {CreateFolderDto, Folder, ShortFolderDto, UpdateFolderDto} from './types/folder.types';
import {Observable} from 'rxjs';
import {Query} from '../../../components/data-table/types/table';

export interface FolderServiceInterface {
  getRoots(): Observable<Folder[]>;
  getAll(): Observable<Folder[]>;
  shortList(query: Query): Observable<ShortFolderDto[]>;
  getChildren(id: string): Observable<Folder[]>;
  create(item: CreateFolderDto): Observable<Folder>;
  update(id: string, item: UpdateFolderDto): Observable<void>;
  delete(id: string): Observable<void>;
  getTree(
    opts?: { sort?: (a: Folder, b: Folder) => number }
  ): Observable<Folder[]>;
  buildTree(
    folders: Folder[],
    opts?: { sort?: (a: Folder, b: Folder) => number }
  ): Folder[];
}
