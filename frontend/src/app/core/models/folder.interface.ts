import {Document} from './document.interface';
import {BaseModelInterface} from './base-model.interface';
import {ChronoApiInterface, ChronoInterface} from './chrono.interface';
import {Guid} from 'guid-typescript';


export interface FolderRequest {
  title?: string;
  description?: string;
  parentId?: Guid;
}


export interface Folder extends BaseModelInterface, ChronoInterface {
  title: string;
  description?: string;
  parentId?: Guid
  documents?: Document[];
  children?: Folder[];
  childrenLoaded?: boolean;
}


export interface FolderApiResponse extends BaseModelInterface, ChronoApiInterface {
  title: string;
  parent_id?: Guid;
  description?: string;
  children?: FolderApiResponse[];
}


export interface FolderApiRequest {
  title?: string,
  description?: string,
  parent_id?: Guid,
}
