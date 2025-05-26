// import {Component, inject} from '@angular/core';
// import {ReactiveFormsModule} from '@angular/forms';
// import {NgForOf} from '@angular/common';
// import {HttpClient} from '@angular/common/http';
// import {AbstractGenericModal} from '../../../core/abstracts/abstract-generic-modal';
// import {environment} from '../../../../environments/environment';
// import {Author, AuthorApiResponse, AuthorCreate} from '../../../core/models/author.interface';
// import {map, Observable} from 'rxjs';
//
// @Component({
//   selector: 'app-author-modal',
//   imports: [
//     ReactiveFormsModule,
//     NgForOf
//   ],
//   templateUrl: './author-modal.component.html',
//   styleUrl: './author-modal.component.scss'
// })
// export class AuthorModalComponent {
//   http = inject(HttpClient);
//   formFieldSchema = [
//     {
//       key: 'firstName',
//       label: 'Имя',
//       placeholder: 'Имя',
//       required: true,
//     },
//     {
//       key: 'lastName',
//       label: 'Фамилия',
//       placeholder: 'Фамилия',
//       required: true,
//     },
//     {
//       key: 'description',
//       label: 'Описание',
//       placeholder: 'Описание',
//       required: false,
//     }
//   ]
//
//   createAuthor(data: AuthorApiResponse): Observable<Author> {
//     return this.http.post<AuthorApiResponse>(`${environment.apiUrl}/documents/authors/`, data)
//       .pipe(
//         map(res => ({
//           id: res.id,
//           firstName: res.first_name,
//           lastName: res.last_name,
//           description: res.description,
//           createdAt: res.created_at,
//           updatedAt: res.updated_at
//         } as Author))
//       );
//   }
//
//   onSubmit(value: AuthorCreate) {
//     const apiData = {
//       first_name: value.firstName,
//       last_name: value.lastName,
//       description: value.description,
//     } as AuthorApiResponse
//
//     this.createAuthor(apiData)
//       .subscribe({
//         next: (author) => {
//           this.closeModal(author);
//         },
//         error: (error) => alert(`Error occurred: ${error.message}`)
//       });
//
//   }
// }
