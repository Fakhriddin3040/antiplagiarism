import {Component, Output, EventEmitter, OnInit, inject, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import {FormFieldConfig} from '../../../core/configs/form-field.interface';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {firstValueFrom, Subject} from 'rxjs';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatInput} from '@angular/material/input';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';


@Component({
  selector: 'app-generic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatAutocomplete, MatOption, MatAutocompleteTrigger, MatInput, MatFormField],
})
export class DynamicModal<T> implements OnInit {
  @Output() submitted = new EventEmitter<T>();

  private fb = inject(FormBuilder);
  private authorSearch$ = new Subject<string>();
  private folderSearch = new Subject<string>();
  displayAuthor = (a: any) => a ? `${a.first_name} ${a.last_name}` : '';

  displayFolder = (f: any) => f ? f.title : '';
  authors: any[] = [];
  filteredAuthors: any[] = [];

  folders: any[] = [];
  filteredFolders: any[] = [];
  http = inject(HttpClient);

  form!: FormGroup;
authorOpen  = false;
folderOpen  = false;

onAuthorInput(e: Event) {
  const q = (e.target as HTMLInputElement).value.toLowerCase();
  this.filteredAuthors = this.authors.filter(a =>
    `${a.first_name} ${a.last_name}`.toLowerCase().includes(q));
}

onFolderInput(e: Event) {
  const q = (e.target as HTMLInputElement).value.toLowerCase();
  this.filteredFolders = this.folders.filter(f =>
    f.title.toLowerCase().includes(q));
}

selectAuthor(a: any) {
  this.form.get('author')!.setValue(a);     // кладём объект
  this.authorOpen = false;
}

selectFolder(f: any) {
  this.form.get('folder')!.setValue(f);
  this.folderOpen = false;
}

/* закрываем выпадашку по blur — через setTimeout,
   чтобы mousedown успел отработать */
closeDropdownLater(which: 'author' | 'folder') {
  setTimeout(() => {
    if (which === 'author')  this.authorOpen = false;
    else                     this.folderOpen = false;
  }, 150);
}
  constructor(
    public dialogRef: MatDialogRef<DynamicModal<T>>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      formFieldSchema: FormFieldConfig[];
      initialData?: Partial<T>;
      titleCreate: string;
      titleUpdate: string;
      submitLabelCreate: string;
      submitLabelUpdate: string;
    }
  ) {}

  async ngOnInit() {
    this.buildForm();

    this.authors = await firstValueFrom(
      this.http.get<any[]>(environment.apiUrl + '/documents/authors/')
    );
    this.folders = await firstValueFrom(
      this.http.get<any[]>(environment.apiUrl + '/folders/')
    );

    this.filteredAuthors = this.authors;
    this.filteredFolders = this.folders;

    this.form.get('author')!.valueChanges.subscribe(val => {
      const q = (val || '').toString().toLowerCase();
      this.filteredAuthors = this.authors.filter(a =>
        `${a.first_name} ${a.last_name}`.toLowerCase().includes(q)
      );
    });

    this.form.get('folder')!.valueChanges.subscribe(val => {
      const q = (val || '').toString().toLowerCase();
      this.filteredFolders = this.folders.filter(f =>
        f.title.toLowerCase().includes(q)
      );
    });
  }

  private buildForm() {
    const group: { [key: string]: any } = {};

    for (let field of this.data.formFieldSchema) {
      let value: any = null;
      if (this.data.initialData && (this.data.initialData as any)[field.key] !== undefined) {
        value = (this.data.initialData as any)[field.key];
      } else if (field.default !== undefined) {
        value = field.default;
      } else {
        switch (field.type) {
          case 'checkbox':
            value = false;
            break;
          case 'array-dnd':
            value = [];
            break;
          default:
            value = '';
        }
      }

      const validators = field.validators ? [...field.validators] : [];
      if (field.required) {
        validators.push(Validators.required);
      }

      if (field.type === 'array-dnd') {
        const arr = this.fb.array([]);
        if (Array.isArray(value) && value.length) {
          for (let item of value) {
            arr.push(this.fb.control(item, validators));
          }
        } else {
          arr.push(this.fb.control('', validators));
        }
        group[field.key] = arr;
      } else {
        group[field.key] = this.fb.control(value, validators);
      }
    }

    this.form = this.fb.group(group);
  }

  get isCreate(): boolean {
    return this.data.mode === 'create';
  }

  onSubmit() {
    if (this.form.valid) {
      const result = this.form.value as T;
      this.dialogRef.close(result);
      this.submitted.emit(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onFileChange(event: any, key: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.get(key)?.setValue(file);
    }
  }

  addArrayItem(key: string) {
    const control = this.form.get(key) as FormArray;
    control.push(this.fb.control(''));
  }

  removeArrayItem(key: string, index: number) {
    const control = this.form.get(key) as FormArray;
    control.removeAt(index);
  }
}
