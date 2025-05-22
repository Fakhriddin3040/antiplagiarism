import {Injectable} from '@angular/core';
import {delay, Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlagiarismService {
  // ... (возможно здесь же метод compareDocuments, как выше) ...

  checkDocument(docId: number): Observable<PlagiarismCheck> {
    // В реальности: return this.http.post<PlagiarismCheck>(`/api/check`, { documentId: docId });
    const document = /* найти документ по docId, например через DocumentService или локальный массив */;
    // Мок-реализация: допустим, сравниваем с каждым документом из базы:
    const matches: PlagiarismMatch[] = [];
    for (let other of /*все документы кроме docId*/) {
      // простая логика: случайно сгенерировать процент совпадения
      const percent = Math.floor(Math.random() * 20); // 0-20% случайно
      if (percent > 5) { // считаем значимым совпадение >5%
        matches.push({
          sourceDocument: other,
          percent: percent,
          overlapWords: percent * 10 // условно число слов
        });
      }
    }
    const maxPercent = matches.length ? Math.max(...matches.map(m => m.percent)) : 0;
    const result: PlagiarismCheck = {
      id: Date.now(),
      documentId: docId,
      checkedAt: new Date().toISOString(),
      resultPercent: maxPercent,
      matches: matches
    };
    return of(result).pipe(delay(1000)); // эмулируем задержку 1с для "проверки"
  }
}
