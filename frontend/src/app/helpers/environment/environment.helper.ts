import {environment} from '../../../environments/environment';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';

export class EnvironmentHelper {
  static makeApiUrl(endpoint: ApiEndpointEnum, endSlash?: boolean): string {
    let result = `${environment.apiUrl}/${endpoint}`;
    if (endSlash && !result.endsWith('/')) {
      result += '/';
    }
    return result;
  }
}
