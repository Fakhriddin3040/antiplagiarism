import {BaseModel} from '../../../types/base.model.type';
import {ChronoModel} from '../../../types/chrono.model.type';
import {Page} from '../../../../components/data-table/types/table';

export class Author implements BaseModel, ChronoModel {
  constructor(
    public id: string,
    public firstName: string,
    public createdAt: Date,
    public updatedAt: Date,
    public lastName?: string,
    public description?: string,
  ) {
  }
}


export class CreateAuthorDto {
  constructor(
    public firstName: string,
    public lastName?: string,
    public description?: string,
  ) {
  }
}

export class ListAuthorDto extends Author {}

export type ShortAuthorDto = BaseModel & {
  firstName: string;
  lastName?: string
}

export type UpdateAuthorDto = Partial<CreateAuthorDto>;
export type AuthorsPage = Page<Author>;
export type ShortAuthorPage = Page<ShortAuthorDto>;
