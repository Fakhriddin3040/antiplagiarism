import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener,
  Input, Output, TemplateRef, ViewChild, computed, effect, model, signal
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-smart-select',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './smart-select.component.html',
  styleUrls: ['./smart-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartSelectComponent<T = any> {
  /** Значение (двухстороннее связывание: [(value)]) */
  value = model<T | null>(null);

  /** Загрузка опций: (term) => Observable<T[]>  */
  @Input({ required: true }) load!: (term: string) => Observable<readonly T[] | T[]>;

  /** Как показывать пункт пользователю */
  @Input({ required: true }) labelOf!: (item: T) => string;

  /** Идентификатор (для track & сравнения). По умолчанию — labelOf(item). */
  @Input() idOf: (item: T) => string | number | string = (i) => this.labelOf(i);

  /** Рендер кастомной опции (опционально). Context: {$implicit: item, label: string, selected: boolean} */
  @Input() optionTpl?: TemplateRef<any>;

  /** Placeholder / UX */
  @Input() placeholder = 'Search...';
  @Input() debounceMs = 250;
  @Input() minChars = 0;
  @Input() disabled = false;
  @Input() openOnFocus = true;

  /** Событие выбора (если нужно отдельно отслеживать) */
  @Output() selected = new EventEmitter<T | null>();

  @ViewChild('inputEl', { static: true }) inputEl!: ElementRef<HTMLInputElement>;

  // state (signals)
  open = signal(false);
  query = signal('');
  options = signal<readonly T[]>([]);
  loading = signal(false);
  highlightIdx = signal<number>(-1);

  // derived
  hasQuery = computed(() => (this.query().trim().length >= this.minChars));
  displayText = computed(() => {
    const v = this.value();
    return v ? this.labelOf(v) : '';
  });

  private sub?: Subscription;
  private timer?: any;

  constructor(private host: ElementRef<HTMLElement>) {
    // если значение извне поменяли — синхронизируем отображение
    effect(() => {
      const v = this.value();
      if (v && this.inputEl) {
        this.inputEl.nativeElement.value = this.labelOf(v);
      }
    });
  }

  // ---- DOM / UX ----
  focus() {
    if (this.disabled) return;
    if (this.openOnFocus) this.open.set(true);
  }

  onInput(term: string) {
    this.query.set(term);
    if (!this.hasQuery()) {
      this.options.set([]);
      this.highlightIdx.set(-1);
      return;
    }
    // дебаунс
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.fetch(), this.debounceMs);
  }

  fetch() {
    if (!this.load) return;
    this.loading.set(true);
    this.sub?.unsubscribe();
    this.sub = this.load(this.query().trim()).subscribe({
      next: (items) => {
        this.options.set(items ?? []);
        this.highlightIdx.set(items.length ? 0 : -1);
        this.loading.set(false);
        this.open.set(true);
      },
      error: err => {
        console.log('Error loading options for SmartSelect');
        console.error(err)
        this.options.set([]);
        this.highlightIdx.set(-1);
        this.loading.set(false);
      },
    });
  }

  pick(item: T) {
    this.value.set(item);
    this.selected.emit(item);
    this.open.set(false);
    // заполним инпут лейблом
    if (this.inputEl) this.inputEl.nativeElement.value = this.labelOf(item);
  }

  clear() {
    this.value.set(null);
    this.selected.emit(null);
    this.inputEl.nativeElement.value = '';
    this.query.set('');
    this.options.set([]);
    this.highlightIdx.set(-1);
  }

  // ---- keyboard nav ----
  onKeydown(e: KeyboardEvent) {
    if (!this.open()) this.open.set(true);
    const opts = this.options();
    if (!opts.length) return;

    const idx = this.highlightIdx();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.highlightIdx.set(Math.min(idx + 1, opts.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.highlightIdx.set(Math.max(idx - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (idx >= 0) this.pick(opts[idx] as T);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.open.set(false);
    }
  }

  isSelected(item: T) {
    const v = this.value();
    return v ? this.idOf(v) === this.idOf(item) : false;
  }

  trackById = (_: number, it: T) => this.idOf(it);

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.host.nativeElement.contains(ev.target as Node)) {
      this.open.set(false);
    }
  }

  protected readonly HTMLInputElement = HTMLInputElement;
}
