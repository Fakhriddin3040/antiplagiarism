import { ChronoModel } from '../../../types/chrono.model.type';
import {AuthorInfoModel} from '../../../types/author-info.model.type';
import {BaseModel} from '../../../types/base.model.type';

export class Folder implements BaseModel, ChronoModel, AuthorInfoModel {
  constructor(
    public id: string,
    public title: string,
    public createdAt: Date,
    public updatedAt: Date,
    public createdById: string,
    public updatedById: string,
    public description?: string,
    public parentId?: string,
    public children: Folder[] = [],
  ) {
  }
}

export class CreateFolderDto {
  constructor(
    public title: string,
    public description?: string,
    public parentId?: string,
  ) {
  }
}

export class UpdateFolderDto {
  constructor(
    public title?: string,
    public description?: string,
    public parentId?: string,
  ) {
  }
}


export interface FolderNode {
  id: string;
  name: string;
  children?: FolderNode[];
  isOpen?: boolean;
}

export type ShortFolderDto = BaseModel & {
  title: string;
}
