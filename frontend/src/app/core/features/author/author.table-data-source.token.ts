import {InjectionToken} from '@angular/core';
import {AuthorTableDataSourceInterface} from './author.table-data-source.interface';

export const AUTHOR_TABLE_DATA_SOURCE = new InjectionToken<AuthorTableDataSourceInterface>('AuthorTableDataSourceInterface');
