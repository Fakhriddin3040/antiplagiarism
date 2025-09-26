import {inject, Injectable, Input, input} from '@angular/core';
import {ModalFieldDef, ModalResult} from '../../core/types/form-types';
import {CreateDocumentDto, Document, ListDocumentDto} from '../../core/features/document/types/document.types';
import {map, Observable} from 'rxjs';
import {ShortAuthorDto} from '../../core/features/author/types/author.types';
import {ShortFolderDto} from '../../core/features/folder/types/folder.types';
import {FormModalService} from '../../core/services/form-modal.service';
import {AUTHOR_SERVICE} from '../../core/features/author/author.service.token';
import {FOLDER_SERVICE} from '../../core/features/folder/folder.service.token';

@Injectable({
  providedIn: 'root'
})
export class DocumentModalService {
  formModalService = inject(FormModalService);
  authorService = inject(AUTHOR_SERVICE);
  folderService = inject(FOLDER_SERVICE);

  fields: ModalFieldDef<ListDocumentDto>[] = [
    {
      key: 'title', label: 'Название', kind: 'text', required: true,
      placeholder: 'Введите название документа',
    },
    {
      kind: 'select-async',
      key: 'authorId',
      label: 'Автор',
      required: true,
      placeholder: 'Выберите автора',
      load: (term) => this.searchAuthors(term),
      labelOf: (a: ShortAuthorDto) => `${a.firstName} ${a.lastName ?? ''}`,
      idOf: (a: ShortAuthorDto) => a.id
    },
    {
      kind: 'select-async',
      key: 'folderId',
      label: 'Директория',
      required: true,
      placeholder: 'Выберите директорию',
      load: (term) => this.searchFolders(term),
      labelOf: (f: ShortFolderDto) => f.title,
      idOf: (f: ShortAuthorDto) => f.id
    },
    {
      kind: 'file',
      key: 'file',
      label: 'Документ',
      required: true,
      placeholder: 'Выберите файл документа или перетащите его сюда',
      accept: '.pdf,.doc,.docx,.md,.txt,.rtf',
      maxSizeMb: 50,
      multiple: false
    }
  ]

  private searchAuthors(term?: string): Observable<ShortAuthorDto[]> {
    return this.authorService.shortList({ search: term ?? '', limit: 20, offset: 0 })
      .pipe(
        map(page => page.rows)
      )
  }

  private searchFolders(term?: string): Observable<ShortFolderDto[]> {
    return this.folderService.shortList({ search: term ?? '', limit: 20, offset: 0 });
  }

  openOnCreate(): Observable<ModalResult<CreateDocumentDto>> {
    return this.formModalService.open<CreateDocumentDto>({
      title: 'Создать документ',
      fields: this.fields,
      confirmLabel: 'Создать',
      requireConfirm: false
    });
  }

  openOnEdit(document: Document): Observable<any> {
    return this.formModalService.open({
      title: 'Редактировать документ',
      fields: this.fields,
      initialValue: {
        title: document.title,
        authorId: document.authorId,
        folderId: document.folderId
      },
      confirmLabel: 'Сохранить',
      requireConfirm: false
    })
  }
}
