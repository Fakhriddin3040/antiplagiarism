import {inject, Injectable} from '@angular/core';
import {DocumentServiceInterface} from '../../core/features/document/document.service.interface';
import { Guid } from 'guid-typescript';
import { Observable } from 'rxjs';
import {Query} from '../../components/data-table/types/table';
import {HttpQueryParser} from '../../core/http/helpers/http-query.parser';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';
import {HttpClient} from '@angular/common/http';
import {DocumentPage} from '../../core/features/document/types/document.types';
import {EnvironmentHelper} from '../../helpers/environment/environment.helper';

@Injectable({
  providedIn: 'root'
})
export class DocumentService implements DocumentServiceInterface {
  httpClient = inject(HttpClient);
  baseUrl = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.DOCUMENTS, false);

  private makeDetailUrl(id: Guid): string {
    return `${EnvironmentHelper.makeApiUrl(ApiEndpointEnum.DOCUMENTS, true)}${id.toString()}`;
}

  getAll(query?: Query): Observable<DocumentPage> {
    const params = query ? HttpQueryParser.makeParams(query) : undefined;
    return this.httpClient.get<DocumentPage>(
      this.baseUrl, { params }
    )
  }

  getById(): Observable<Document> {
      throw new Error('Method not implemented.');
  }

  delete(id: Guid): Observable<void> {
      return this.httpClient.delete<void>(
        this.makeDetailUrl(id)
      );
  }

  bulkDelete(ids: Guid[]): Observable<void> {
    ids.forEach((id) => {
      this.httpClient.delete<void>(
        this.makeDetailUrl(id)
      )
    })
    return new Observable<void>();
  }
}
