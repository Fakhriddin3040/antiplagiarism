import {ChronoModel} from '../../../types/chrono.model.type';
import {BaseModel} from '../../../types/base.model.type';
import {Page} from '../../../../components/data-table/types/table';
import {ShortAuthorDto} from '../../author/types/author.types';


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
}

export type Document = BaseModel & ChronoModel & {
  title: string,
  authorId: string,
  isIndexed: boolean,
  checkedAt: Date | null,
  folderId: string,
  file: LocalFile
}

export type CreateDocumentDto = {
  title: string,
  authorId: string,
  folderId: string,
  file: File
}


export type DocumentPage = Page<Document>
