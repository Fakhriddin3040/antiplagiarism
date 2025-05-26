import {BaseModelInterface} from './base-model.interface';
import {ChronoApiInterface, ChronoInterface} from './chrono.interface';

export interface File extends BaseModelInterface, ChronoInterface {
  title: string;
  description?: string;
  path: string;
  extension?: string;
  mimetype: string;
}


export interface FileApiResponse extends BaseModelInterface, ChronoApiInterface {
  title: string;
  description?: string;
  path: string;
  extension?: string;
  mimetype: string;
}


export interface FileRequest {
  title: string;
  description?: string;
  file: File;
}
