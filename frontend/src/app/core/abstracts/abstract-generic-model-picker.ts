import {Directive, inject} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Directive()
export abstract class AbstractGenericModelPicker<T, TRequest>
  implements ControlValueAccessor {
  items: T[] = [];
  value?: T;

  abstract placeholder: string;
  abstract apiUrl: string;

  isOpen: boolean = false;

  http = inject(HttpClient)

  protected onChange = (_: any) => {};
  protected _onTouched = () => {};

  fetchItems(): void {
    this.http.get<TRequest[]>(this.apiUrl)
      .subscribe({
        next: (data) => {
          this.setItems(data);
        },
        error: (err) => {
          console.error('Error fetching items:', err);
        }
      })
  }

  abstract mapApiItems(data: TRequest[]): T[];
  abstract formatItem(item: T): string;

  setItems(data: TRequest[]): void {
    if (this.items) return;
    this.items = this.mapApiItems(data);
  }


  onTouched(): void {
    if(!this.isOpen) {
      this.fetchItems();
    }
    this._onTouched();
  }

  registerOnChange(fn: (value: T) => void): void {
    this.onChange = fn
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.isOpen = false;
    this.onChange(obj);
    this.onTouched();
  }
}
