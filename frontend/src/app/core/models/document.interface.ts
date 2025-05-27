import {BaseModelInterface} from './base-model.interface';
import {ChronoApiInterface, ChronoInterface} from './chrono.interface';
import {Guid} from 'guid-typescript';
import {FileApiResponse, File as FileModel} from './file.interface';

export interface Document extends BaseModelInterface, ChronoInterface {
  authorId: Guid,
  title: string;
  isIndexed?: boolean;
  indexedAt?: Date;
  checked?: boolean,
  checkedAt?: Date;
  verdict?: Number,
  folderId: Guid;
  description?: string;
  file: FileModel,
  showMenu?: boolean;
}


export interface DocumentApiResponse extends BaseModelInterface, ChronoApiInterface {
  author_id: Guid;
  title: string;
  is_indexed: boolean;
  indexed_at?: Date;
  checked?: boolean;
  checked_at?: Date;
  verdict: Number;
  folder_id: Guid;
  description?: string;
  file: FileApiResponse;
}


export interface DocumentApiRequest {
  title: string;
  description?: string;
  file: File;
  index_it?: boolean;
  folder_id: Guid;
  author_id: Guid;
}
