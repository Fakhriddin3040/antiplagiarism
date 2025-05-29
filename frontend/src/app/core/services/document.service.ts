import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {DocumentApiRequest, DocumentApiResponse, DocumentRequest} from '../models/document.interface';
import {Document} from '../models/document.interface';
import {map, Observable} from 'rxjs';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/documents`;

  mapResult(object: DocumentApiResponse): Document {
    return {
      id: object.id,
      title: object.title,
      authorId: object.author_id,
      folderId: object.folder_id,
      description: object.description,
      isIndexed: object.is_indexed,
      indexedAt: object.indexed_at,
      checked: object.checked,
      checkedAt: object.checked_at,
      createdAt: object.created_at,
      updatedAt: object.updated_at,
      file: {
        id: object.file.id,
        title: object.file.title,
        description: object.file.description,
        extension: object.file.extension,
        mimetype: object.file.mimetype,
        path: object.file.path,
        createdAt: object.file.created_at,
        updatedAt: object.file.updated_at
      }
    } as Document
  }

  mapResults(objects: DocumentApiResponse[]): Document[] {
    return objects.map((object) => this.mapResult(object));
  }

  getAllDocuments(): Observable<Document[]> {
    return this.http.get<DocumentApiResponse[]>(this.apiUrl)
      .pipe(
        map((response) => {
          return this.mapResults(response);
        })
      )
  }

  delete(id: Guid): Observable<Object> {
    return this.http.delete(this.apiUrl + '/' + id);
  }

  create(data: DocumentRequest): Observable<Document> {
    const requestData: DocumentApiRequest= {
      title: data.title,
      description: data.description,
      file: data.file,
      index_it: data.indexIt,
      folder_id: data.folderId,
      author_id: data.authorId,
    };
    return this.http.post<DocumentApiResponse>(this.apiUrl + '/', requestData)
      .pipe(map((response) => {
        return this.mapResult(response);
        })
      )
  }
}
