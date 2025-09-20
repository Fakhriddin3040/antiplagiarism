import {AuthorTableDataSourceInterface} from '../../core/features/author/author.table-data-source.interface';
import {Observable} from 'rxjs';
import {Page, Query} from '../../components/data-table/types/table';
import {ListAuthorDto} from '../../core/features/author/types/author.types';
import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvironmentHelper} from '../../helpers/environment/environment.helper';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';

export class AuthorTableDataSource implements AuthorTableDataSourceInterface {
  private readonly API_URL = EnvironmentHelper.makeApiUrl(ApiEndpointEnum.AUTHORS);

  private readonly _httpClient = inject(HttpClient);

  fetch(q: Query): Observable<Page<ListAuthorDto>> {
    return null!
  }

}
