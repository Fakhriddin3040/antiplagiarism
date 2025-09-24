import {Guid} from 'guid-typescript';
import {ChronoModel} from '../../../types/chrono.model.type';
import {BaseModel} from '../../../types/base.model.type';
import {Page} from '../../../../components/data-table/types/table';
import {ListAuthorDto, ShortAuthorDto} from '../../author/types/author.types';


export enum PlagiarismVerdict {
  PLAGIARISM = 1,
  PARTIAL_PLAGIARISM = 2,
  UNIQUE = 3
}

export const plagiarismVerdictLabels: Record<PlagiarismVerdict, string> = {
  [PlagiarismVerdict.PLAGIARISM]: 'Плагиат',
  [PlagiarismVerdict.PARTIAL_PLAGIARISM]: 'Частичный плагиат',
  [PlagiarismVerdict.UNIQUE]: 'Уникальный'
}


export type LocalFile = BaseModel & ChronoModel & {
  title: string,
  path: string,
  extension: string,
  mimetype: string
}

export type ListDocumentDto = BaseModel & ChronoModel & {
  title: string,
  author: ShortAuthorDto,
  isIndexed: boolean,
  checkedAt: boolean,
  indexedAt: boolean
}

export type Document = BaseModel & ChronoModel & {
  title: string,
  authorId: Guid,
  isIndexed: boolean,
  indexedAt: Date | null,
  checkedAt: Date | null,
  folderId: Guid,
  file: LocalFile
}

export type CreateDocumentDto = {
  title: string,
  author_id: Guid,
  folder_id: Guid,
  file: File
}


export type DocumentPage = Page<Document>
