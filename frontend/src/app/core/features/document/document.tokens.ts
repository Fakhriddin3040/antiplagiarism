import {InjectionToken} from '@angular/core';
import {DocumentDataSourceInterface} from './document.data-source.interface';
import {DocumentService} from '../../../features/document/document.service';

export const DOCUMENT_DATA_SOURCE = new InjectionToken<DocumentDataSourceInterface>("DocumentDataSourceInterface");
export const DOCUMENT_SERVICE = new InjectionToken<DocumentService>("DocumentService");
