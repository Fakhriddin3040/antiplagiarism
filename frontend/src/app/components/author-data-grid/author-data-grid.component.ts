import { Component } from '@angular/core';
import {ApiQueryParam, ColumnDef, ModelConfig} from '../../core/types/datagrid';
import {Author} from '../../core/models/author.interface';

@Component({
  selector: 'app-author-data-grid',
  imports: [],
  templateUrl: './author-data-grid.component.html',
  styleUrl: './author-data-grid.component.scss'
})
export class AuthorDataGridComponent {
  ModelConfig: ModelConfig<Author> = {
    title: "Authors",
    name: "author",
    idKey: "id",
    filters: [
      {
        key: "firstName",
        label: "First Name",
        operators: ["eq"],
        defaultOperator: "eq",
        type: "text"
      }
    ],
    api: {
      buildQuery(filters: ApiQueryParam[], sort?: {
        field: string;
        direction: "asc" | "desc"
      }, limit?: number, offset?: number): Record<string, any> {

      }
    }
  }
}
