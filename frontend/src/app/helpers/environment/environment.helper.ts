import {environment} from '../../../environments/environment';
import {ApiEndpointEnum} from '../../shared/enums/routing/api-endpoint.enum';

export class EnvironmentHelper {
  static makeApiUrl(endpoint: ApiEndpointEnum): string {
    return `${environment.apiUrl}/${endpoint}`;
  }
}
