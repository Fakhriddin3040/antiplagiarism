import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DocumentService} from '../../core/services/document-service';
import {PlagiarismService} from '../../core/services/plagiarism-result-service';
import {Document} from '../../core/interfaces/document-interface';

@Component({
  selector: 'app-check-result',
  imports: [],
  templateUrl: './check-result.component.html',
  styleUrl: './check-result.component.scss'
})
// check-result.component.ts
export class CheckResultComponent implements OnInit {
  document: Document;
  check: PlagiarismCheck;

  constructor(private route: ActivatedRoute,
              private documentService: DocumentService,
              private plagiarismService: PlagiarismService) {}

  ngOnInit() {
    const docId = Number(this.route.snapshot.paramMap.get('documentId'));
    if (docId) {
      // загрузим документ (для вывода названия, автора)
      this.documentService.getDocument(docId).subscribe(doc => this.document = doc);
      // запустим проверку
      this.plagiarismService.checkDocument(docId).subscribe(checkResult => {
        this.check = checkResult;
      });
    }
  }
}
