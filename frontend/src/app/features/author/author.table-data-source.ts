import {AuthorTableDataSourceInterface} from '../../core/features/author/author.table-data-source.interface';
import {Observable} from 'rxjs';
import {Query} from '../../components/data-table/types/table';
import {AuthorsPage, ListAuthorDto} from '../../core/features/author/types/author.types';
import {inject} from '@angular/core';
import {AUTHOR_SERVICE} from '../../core/features/author/author.service.token';

export class AuthorTableDataSource implements AuthorTableDataSourceInterface {
  authorService = inject(AUTHOR_SERVICE);

  fetch(q: Query): Observable<AuthorsPage> {
    return this.authorService.getAll(q);
  }

}
