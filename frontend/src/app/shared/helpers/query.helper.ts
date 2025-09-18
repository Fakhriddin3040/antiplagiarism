import {Query} from '../../components/data-table/types/table';
import {HttpParams} from '@angular/common/http';
import {QueryConst} from '../../core/enums/query.enum';

export class QueryHelper {
  static toHttpParams(query: Query): HttpParams {
    let params = new HttpParams();

    params = params.set('limit', String(query.limit ?? QueryConst.DEFAULT_LIMIT));
    params = params.set('offset', String(query.offset ?? QueryConst.DEFAULT_OFFSET));

    if (query.search) {
      params.set('search', query.search);
    }

    if (query.sort) {
      params = params.set('sort', query.sort.map((value) => `${value.field}=${value.dir}`).join(","));
    }

    if (query.filters) {
      Object.entries(query.filters).forEach(([field, value]) => {
        if (String(value).trim() !== '') {
          params = params.set(field, String(value));
        }
      });
    }

    return params;
  }
}
