// form-modal.service.ts
import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent, Injector } from '@angular/core';
import { FieldDef, ModalResult } from './form-types';
import {DynamicFormModalComponent} from './dynamic-form-modal/dynamic-form-modal.component';

@Injectable({ providedIn: 'root' })
export class FormModalService {
  constructor(
    private appRef: ApplicationRef,
    private env: EnvironmentInjector,
    private injector: Injector,
  ) {}

  open<T extends Record<string, any>>(opts: {
    title?: string;
    confirmLabel?: string;
    fields: FieldDef[];
    initialValue?: Partial<T>;
    requireConfirm?: boolean;
  }): Promise<ModalResult<T>> {
    const ref: ComponentRef<DynamicFormModalComponent> = createComponent(DynamicFormModalComponent, {
      environmentInjector: this.env,
      elementInjector: this.injector,
    });

    const hostEl = ref.location.nativeElement as HTMLElement;
    document.body.appendChild(hostEl);
    this.appRef.attachView(ref.hostView);

    // конфиг
    ref.instance.title = opts.title ?? 'Форма';
    ref.instance.confirmLabel = opts.confirmLabel ?? 'Сохранить';
    ref.instance.fields = opts.fields;
    ref.instance.initialValue = (opts.initialValue ?? {}) as any;
    ref.instance.requireConfirm = opts.requireConfirm ?? true;

    // показать
    ref.instance.show();

    return new Promise<ModalResult<T>>(resolve => {
      const sub = ref.instance.closed.subscribe((res) => {
        sub.unsubscribe();
        this.appRef.detachView(ref.hostView);
        ref.destroy();
        resolve(res as ModalResult<T>);
      });
    });
  }
}
