import {inject, Injectable} from '@angular/core';
import {PlagiarismCheckServiceInterface} from '../../core/features/plagiarism-check/plagiarism-check.service.interface';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';
import {EnvironmentHelper} from '../../helpers/environment/environment.helper';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { PlagiarismCheck } from '../../core/features/plagiarism-check/types/plagiarism-check.types';

@Injectable({
  providedIn: 'root'
})
export class PlagiarismCheckService implements PlagiarismCheckServiceInterface {
  httpClient = inject(HttpClient);

  makeUrl(doc_id: string): string {
    return `${EnvironmentHelper.makeApiUrl(ApiEndpointEnum.DOCUMENTS, true)}${doc_id}/${ApiEndpointEnum.PLAGIARISM_CHECK}/`;
  }

  getForDocument(documentId: string): Observable<PlagiarismCheck> {
      return this.httpClient.get<PlagiarismCheck>(
        this.makeUrl(documentId)
      )
  }

  checkDocument(documentId: string): Observable<void> {
      return this.httpClient.post<void>(
        this.makeUrl(documentId),
        {}
      )
  }
}
