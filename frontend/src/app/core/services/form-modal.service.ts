// form-modal.service.ts
import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  Injector,
  inject
} from '@angular/core';
import {ModalFieldDef, ModalResult} from '../types/form-types';
import {DynamicFormModalComponent} from '../../components/dynamic-form-modal/dynamic-form-modal.component';
import {ConfirmModalOptions, defaultConfirmModalOptions} from '../../shared/modals/types/confirm.modal.types';
import {finalize, map, Observable, take} from 'rxjs';


export type FormModalOptions<T> = {
  fields: ModalFieldDef[];
  title?: string;
  initialValue?: Partial<T>;
  requireConfirm?: boolean;
  confirmLabel?: string;
  confirmOpts?: ConfirmModalOptions
}


@Injectable({ providedIn: 'root' })
export class FormModalService {
    private appRef = inject(ApplicationRef);
    private env = inject(EnvironmentInjector);
    private injector = inject(Injector);

  open<T extends Record<string, any>>(opts: FormModalOptions<T>): Observable<ModalResult<T>> {
    const ref = createComponent(DynamicFormModalComponent, {
      environmentInjector: this.env,
      elementInjector: this.injector,
    });

    const hostEl = ref.location.nativeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.appendChild(hostEl);
    document.body.style.overflow = 'hidden'; // заблокировать скролл фона
    this.appRef.attachView(ref.hostView);

    // Передача через setInput
    ref.setInput('title', opts.title ?? 'Форма');
    ref.setInput('requireConfirm', opts.requireConfirm ?? true);
    ref.setInput('fields', opts.fields);
    ref.setInput('initialValue', (opts.initialValue ?? {}) as any);
    ref.setInput('confirmOpts', opts.confirmOpts ?? defaultConfirmModalOptions);

    // Показ
    ref.changeDetectorRef.detectChanges();
    ref.instance.show();

    const cleanup = () => {
      try {
        this.appRef.detachView(ref.hostView);
      } catch {}
      try {
        ref.destroy();
      } catch {}
      document.body.style.overflow = prevOverflow;
    };

    // Используем сам эмиттер как Observable
    return ref.instance.closed.pipe(
      take(1),        // одно значение
      map((r): ModalResult<T> => r as ModalResult<T>), //
      finalize(cleanup)
    );
  }
}
