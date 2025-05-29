import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient } from '@angular/common/http';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map, tap } from 'rxjs/operators';
import {FormFieldConfig} from '../../../core/configs/form-field.interface';
import {makeQSearchParam} from '../../../helpers/functions/api';

@Component({
  selector: 'app-search-select-field',
  standalone: true,
  imports: [CommonModule, NgSelectModule, ReactiveFormsModule],
  templateUrl: './search-select.component.html',
  styleUrls: ['./search-select.component.scss']
})
export class SearchSelectFieldComponent implements OnInit {
  @Input() config!: FormFieldConfig;
  @Input() formControl!: FormControl;

  items: Array<{ label: string, value: any }> = [];
  loading = false;
  private search$ = new Subject<string>();

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.search$.pipe(
      filter(term => term.length >= 2),
      distinctUntilChanged(),
      debounceTime(300),
      tap(() => this.loading = true),
      switchMap((term) => {
        return this.http.get<any[]>(
          this.config.additionalProps!.search!.apiUrl,
          { params: makeQSearchParam(term, this.config.additionalProps!.search!.searchProps) }
        );
      }),
      map(results => results.map(item => ({
        label: this.config.additionalProps!.search!.searchProps
          .map((prop: string) => item[prop]).join(' '),
        value: item
      }))),
      tap(() => this.loading = false)
    ).subscribe(opts => this.items = opts);
  }

  onSearch(term: string) {
    this.search$.next(term);
  }
}
