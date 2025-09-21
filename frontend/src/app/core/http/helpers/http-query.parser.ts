import {HttpParams} from '@angular/common/http';
import {Query} from '../../../components/data-table/types/table';
import {QueryConst} from '../../enums/query.enum';

export class HttpQueryParser {
  static makeParams(q: Query): HttpParams {
    let params = new HttpParams();

    params = params.set('limit', q.limit ?? QueryConst.DEFAULT_LIMIT);
    params = params.set('offset', q.offset ?? QueryConst.DEFAULT_OFFSET);

    if (q.search) {
      params = params.set('search', q.search);
    }

    if (q.sort) {
      params = params.set(
        'sort',
        q.sort.map(
          ({field, dir}) => `${field}=${dir}`).join(",")
      )
    }

    if (q.filters) {
      params = params.set(
        'filters',
        Object.entries<Record<string, any>>(q.filters)
          .map(([key, value]) => `${key}=${value}`)
          .join(",")
      );
    }
   return params;
  }
}
