import {InjectionToken} from '@angular/core';
import {FolderServiceInterface} from './folder.service.interface';

export const FOLDER_SERVICE = new InjectionToken<FolderServiceInterface>('FOLDER_SERVICE');
