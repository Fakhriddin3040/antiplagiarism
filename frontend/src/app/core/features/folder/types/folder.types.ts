import {Guid} from 'guid-typescript';
import { ChronoModel } from '../../../types/chrono.model.type';
import {AuthorInfoModel} from '../../../types/author-info.model.type';
import {BaseModel} from '../../../types/base.model.type';

export class Folder implements BaseModel, ChronoModel, AuthorInfoModel {
  constructor(
    public id: Guid,
    public title: string,
    public createdAt: Date,
    public updatedAt: Date,
    public createdById: Guid,
    public updatedById: Guid,
    public description?: string,
    public parentId?: Guid,
  ) {
  }
}

export class CreateFolderDto {
  constructor(
    public title: string,
    public description?: string,
    public parentId?: Guid,
  ) {
  }
}

export class UpdateFolderDto {
  constructor(
    public title?: string,
    public description?: string,
    public parentId?: Guid,
  ) {
  }
}
