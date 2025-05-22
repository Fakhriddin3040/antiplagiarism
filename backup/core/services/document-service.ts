import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Injectable} from '@angular/core';
import {Document} from '../interfaces/document-interface';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private documents: Document[] = [
    // мок-данные документов
    { id: 101, title: 'Курсовая работа', authorId: 1, folderId: 2, uploadDate: '2025-05-01', status: 'CHECKED', plagiarismPercent: 15 },
    { id: 102, title: 'Отчет по проекту', authorId: 2, folderId: 3, uploadDate: '2025-05-10', status: 'NEW' },
    // ... и др.
  ];

  constructor(private http: HttpClient) {}

  getDocuments(folderId: number): Observable<Document[]> {
    // Реальный вызов REST API (пример):
    // return this.http.get<Document[]>(`/api/folders/${folderId}/documents`);
    const docs = this.documents.filter(doc => doc.folderId === folderId);
    return of(docs);
  }

  searchDocuments(query: string): Observable<Document[]> {
    // пример фильтрации по заголовку или другим полям
    const q = query.toLowerCase();
    const result = this.documents.filter(doc => doc.title.toLowerCase().includes(q));
    return of(result);
  }

  addDocument(doc: Partial<Document>): Observable<Document> {
    // В реальности: return this.http.post<Document>('/api/documents', doc);
    const newDoc: Document = {
      id: Date.now(), // упрощенно генерируем ID
      title: doc.title || 'Без названия',
      authorId: doc.authorId || 0,
      folderId: doc.folderId!,
      uploadDate: new Date().toISOString(),
      status: 'NEW'
    };
    this.documents.push(newDoc);
    return of(newDoc);
  }

  // ... updateDocument, deleteDocument можно добавить аналогично.
}
