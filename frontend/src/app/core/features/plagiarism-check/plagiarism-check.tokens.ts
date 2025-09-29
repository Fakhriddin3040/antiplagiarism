import {PlagiarismCheckServiceInterface} from './plagiarism-check.service.interface';
import {InjectionToken} from '@angular/core';

export const PLAGIARISM_CHECK_SERVICE = new InjectionToken<PlagiarismCheckServiceInterface>("PlagiarismCheckServiceInterface");
