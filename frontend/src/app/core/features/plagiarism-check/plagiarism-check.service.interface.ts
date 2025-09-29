import {Observable} from 'rxjs';
import {PlagiarismCheck} from './types/plagiarism-check.types';

export interface PlagiarismCheckServiceInterface {
  getForDocument(documentId: string): Observable<PlagiarismCheck>;
  checkDocument(documentId: string): Observable<void>;
}
