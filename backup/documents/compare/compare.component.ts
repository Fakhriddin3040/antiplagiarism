// compare.component.ts
import {DocumentService} from '../../core/services/document-service';
import {ActivatedRoute} from '@angular/router';
import {OnInit} from '@angular/core';
import {Document} from '../../core/interfaces/document-interface';

export class CompareComponent implements OnInit {
  doc1: Document;
  doc2: Document;
  result: PlagiarismMatch[] = [];
  similarityPercent: number | null = null;

  constructor(private route: ActivatedRoute,
              private documentService: DocumentService,
              private plagiarismService: PlagiarismService) {}

  ngOnInit() {
    // Ожидаем, что роут передаст два ID документов для сравнения
    const id1 = Number(this.route.snapshot.queryParamMap.get('doc1'));
    const id2 = Number(this.route.snapshot.queryParamMap.get('doc2'));
    if (id1 && id2) {
      // загрузим документы
      this.documentService.getDocument(id1).subscribe(doc => this.doc1 = doc);
      this.documentService.getDocument(id2).subscribe(doc => this.doc2 = doc);
      // запустим сравнение
      this.plagiarismService.compareDocuments(id1, id2).subscribe(res => {
        this.result = res.matches;
        this.similarityPercent = res.similarity;
      });
    }
  }
}
