import {inject, Injectable} from '@angular/core';
import {Author, AuthorApiRequest, AuthorApiResponse, AuthorRequest} from './core/models/author.interface';
import {map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private http = inject(HttpClient);
  apiUrl = environment.apiUrl;

  mapResult(result: AuthorApiResponse): Author {
    return {
      id: result.id,
      firstName: result.first_name,
      lastName: result.last_name,
      description: result.description,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    }
  }

  mapResults(results: AuthorApiResponse[]): Author[] {
    return results.map(result => this.mapResult(result));
  }

  getAllAuthors(): Observable<Author[]> {
    return this.http.get<AuthorApiResponse[]>(
      this.apiUrl + '/documents/authors/'
    ).pipe(map((response) => this.mapResults(response)))
  }

  create(data: AuthorRequest): Observable<Author> {
    const apiData: AuthorApiRequest = {
      first_name: data.firstName,
      last_name: data.lastName,
      description: data.description
    }
    return this.http.post<AuthorApiResponse>(
      this.apiUrl + '/documents/authors/',
      apiData
    ).pipe(map((response) => this.mapResult((response))))
  }

  delete(id: Guid): Observable<Object> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}
