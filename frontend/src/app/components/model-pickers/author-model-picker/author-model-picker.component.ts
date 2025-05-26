import { Component } from '@angular/core';
import {Author, AuthorApiResponse} from '../../../core/models/author.interface';
import {environment} from '../../../../environments/environment';
import {AbstractGenericModelPicker} from '../../../core/abstracts/abstract-generic-model-picker';

@Component({
  selector: 'app-author-model-picker',
  imports: [],
  templateUrl: './author-model-picker.component.html',
  styleUrl: './author-model-picker.component.scss'
})
export class AuthorModelPickerComponent extends AbstractGenericModelPicker<Author, AuthorApiResponse>{
  override apiUrl: string = `${environment.apiUrl}/documents/authors`;
  override placeholder: string = 'Выберите автора'

  override mapApiItems(data: AuthorApiResponse[]): Author[] {
    return data.map(
      (item: AuthorApiResponse) => {
        return {
          id: item.id,
          firstName: item.first_name,
          lastName: item.last_name,
          created_at: item.created_at,
          updated_at: item.updated_at,
        } as Author
      }
    )
  }

  formatItem(item: Author): string {
    return `${item.firstName} ${item.lastName}`;
  }
}
