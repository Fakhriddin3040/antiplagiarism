import {ChronoApiInterface, ChronoInterface} from './chrono.interface';
import {BaseModelInterface} from './base-model.interface';

export interface Author extends ChronoInterface, BaseModelInterface {
  firstName: string;
  lastName: string;
  description?: string;
}


export interface AuthorRequest {
  firstName?: string;
  lastName?: string;
  description?: string;
}

export interface AuthorCreate {
  firstName: string;
  lastName: string;
  description?: string;
}

export interface AuthorApiRequest {
  first_name?: string;
  last_name?: string;
  description?: string;
}


export interface AuthorUpdate {
  firstName: string;
  lastName: string;
  description?: string;
}

export interface AuthorApiResponse extends ChronoApiInterface, BaseModelInterface {
  first_name: string;
  last_name: string;
  description?: string;
}
