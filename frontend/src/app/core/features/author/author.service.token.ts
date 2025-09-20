import {InjectionToken} from '@angular/core';
import {AuthorServiceInterface} from './author.service.interface';

export const AUTHOR_SERVICE = new InjectionToken<AuthorServiceInterface>('AuthorServiceInterface');
