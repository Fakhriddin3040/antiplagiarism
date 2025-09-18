// form-modal.service.ts
import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, createComponent, Injector } from '@angular/core';
import { FieldDef, ModalResult } from './form-types';
import { DynamicFormModalComponent } from './dynamic-form-modal/dynamic-form-modal.component';

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

    // передаём всё через Angular Inputs (корректно для сеттеров/readonly)
    ref.setInput('title', opts.title ?? 'Форма');
    ref.setInput('confirmLabel', opts.confirmLabel ?? 'Сохранить');
    ref.setInput('requireConfirm', opts.requireConfirm ?? true);
    ref.setInput('fields', opts.fields);                   // попадёт в @Input('fields') set formFields(...)
    ref.setInput('initialValue', (opts.initialValue ?? {}) as any);

    // показать
    ref.instance.show();
    ref.changeDetectorRef.detectChanges();

    return new Promise<ModalResult<T>>(resolve => {
      const sub = ref.instance.closed.subscribe(res => {
        sub.unsubscribe();
        this.appRef.detachView(ref.hostView);
        ref.destroy();
        resolve(res as ModalResult<T>);
      });
    });
  }
}
