import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Guid } from 'guid-typescript';
import {Author, CreateAuthorDto, UpdateAuthorDto} from '../../core/features/author/types/author.types';
import {AuthorServiceInterface} from '../../core/features/author/author.service.interface';
import {EnvironmentHelper} from '../../helpers/environment/environment.helper';
import { ApiEndpointEnum } from '../../shared/enums/routing/api-endpoint.enum';

function normalizeAuthor(a: Author): Author {
  // Приводим поля времени к Date (если пришли строками)
  const createdAt = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as unknown as string);
  const updatedAt = a.updatedAt instanceof Date ? a.updatedAt : new Date(a.updatedAt as unknown as string);
  return { ...a, createdAt, updatedAt };
}

@Injectable({ providedIn: 'root' })
export class AuthorService implements AuthorServiceInterface {
  private http = inject(HttpClient);
  private baseUrl = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.AUTHORS);

  private detailUrl(id: Guid): string {
    return `${this.baseUrl}/${id.toString()}`;
  }

  getAll(): Observable<Author[]> {
    return this.http
      .get<Author[]>(this.baseUrl)
      .pipe(map(list => (list ?? []).map(normalizeAuthor)));
  }

  getById(id: Guid): Observable<Author> {
    return this.http
      .get<Author>(this.detailUrl(id))
      .pipe(map(normalizeAuthor));
  }

  create(item: CreateAuthorDto): Observable<Author> {
    return this.http
      .post<Author>(this.baseUrl, item)
      .pipe(map(normalizeAuthor));
  }

  update(id: Guid, item: UpdateAuthorDto): Observable<void> {
    return this.http.patch<void>(this.detailUrl(id), item);
  }

  delete(id: Guid): Observable<void> {
    return this.http.delete<void>(this.detailUrl(id));
  }
}
