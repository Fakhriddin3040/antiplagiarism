import {
  ChangeDetectionStrategy, Component, Input, Output, EventEmitter, signal, computed
} from '@angular/core';
import {SmartSelectComponent} from '../../../smart-select/smart-select.component';
import {FileDropComponent} from '../../file-drop/file-drop.component';
import {FieldDef, ModalResult} from '../form-types';

@Component({
  selector: 'app-dynamic-form-modal',
  standalone: true,
  imports: [SmartSelectComponent, FileDropComponent],
  templateUrl: './dynamic-form-modal.component.html',
  styleUrl: './dynamic-form-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicFormModalComponent {
  // -------- управление --------
  readonly open = signal(false);

  // -------- входные (простые) --------
  @Input() title = 'Форма';
  @Input() confirmLabel = 'Сохранить';
  @Input() requireConfirm = true;

  // -------- входные (через сеттеры, чтобы синкать стейт) --------
  private readonly _fields = signal<FieldDef[]>([]);
  private readonly _initialValue = signal<Record<string, any>>({});

  // алиасируем input "fields" в сеттер formFields
  @Input('fields') set formFields(v: FieldDef[] | null | undefined) {
    this._fields.set(v ?? []);
    this.syncInitial(); // поля поменялись — пересоберём начальное value
  }

  @Input() set initialValue(v: Record<string, any> | null | undefined) {
    this._initialValue.set(v ?? {});
    this.syncInitial(); // initial меняется — пересоберём
  }

  // -------- выход --------
  @Output() closed = new EventEmitter<ModalResult<Record<string, any>>>();

  // -------- state --------
  readonly value = signal<Record<string, any>>({});

  // Доступ к полям как к вычислимому сигналу — удобно вызывать fields() в шаблоне
  readonly fields = computed(() => this._fields());

  // -------- derived --------
  readonly confirmDisabled = computed(() => {
    if (!this.requireConfirm) return false;
    for (const f of this.fields()) {
      if (!f.required) continue;
      const v = this.value()[f.key];
      if (v === '' || v == null || (Array.isArray(v) && v.length === 0)) return true;
    }
    return false;
  });

  // -------- API --------
  show(data?: Record<string, any>) {
    if (data) this.value.update(prev => ({ ...prev, ...data }));
    this.open.set(true);
  }

  close(confirmed: boolean) {
    this.open.set(false);
    this.closed.emit({ confirmed, value: this.value() });
  }

  // helpers для шаблона
  get = (k: string) => this.value()[k];
  set(k: string, v: any) { this.value.update(obj => ({ ...obj, [k]: v })); }

  toCssWidth(w?: number | string) {
    if (typeof w === 'number') return String(w);
    if (typeof w === 'string') return w.replace('span', '').trim();
    return '6';
  }

  // -------- внутренняя синхронизация стартовых значений --------
  private syncInitial() {
    // базовые значения
    const init: Record<string, any> = { ...this._initialValue() };

    // проставим initialId для select-async, если ключ ещё не задан
    for (const f of this._fields()) {
      if (f.kind === 'select-async') {
        const sa = f;
        if (sa.initialId !== undefined && init[f.key] === undefined) {
          init[f.key] = sa.initialId ?? null; // строго id
        }
      }
    }

    this.value.set(init);
  }
}
