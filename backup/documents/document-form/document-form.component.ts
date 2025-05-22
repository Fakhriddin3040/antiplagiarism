import {FormBuilder} from '@angular/forms';
import {DocumentService} from '../../core/services/document-service';

export class DocumentFormComponent implements OnInit {
  docForm: FormGroup;
  authors: Author[] = [];

  constructor(private fb: FormBuilder,
              private documentService: DocumentService,
              private authorService: AuthorService,
              @Inject(MAT_DIALOG_DATA) public data: { folderId: number },
              private dialogRef: MatDialogRef<DocumentFormComponent>) {}

  ngOnInit() {
    this.docForm = this.fb.group({
      title: ['', Validators.required],
      authorId: [null, Validators.required],
      file: [null, Validators.required]
    });
    // загрузить список авторов (мок или запрос)
    this.authorService.getAuthors().subscribe(list => this.authors = list);
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      // Мы могли бы сохранять файл, например, this.docForm.patchValue({ file: file });
      // или сразу загружать файл на сервер через сервис.
    }
  }

  save() {
    if (this.docForm.valid) {
      const newDoc = {
        title: this.docForm.value.title,
        authorId: this.docForm.value.authorId,
        folderId: this.data.folderId
        // content или file можно отправить через другой метод, если нужно
      };
      this.documentService.addDocument(newDoc).subscribe(createdDoc => {
        this.dialogRef.close(createdDoc);
      });
    }
  }
}
