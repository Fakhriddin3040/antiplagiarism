import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  Injector,
  inject,
} from '@angular/core';
import { Observable, finalize, map, take } from 'rxjs';
import { ConfirmModalComponent } from '../confirm.modal/confirm.modal.component';
import {
  ConfirmModalOptions,
  defaultConfirmModalOptions,
} from '../types/confirm.modal.types';

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
  private appRef = inject(ApplicationRef);
  private env = inject(EnvironmentInjector);
  private injector = inject(Injector);

  confirm(opts: ConfirmModalOptions = defaultConfirmModalOptions): Observable<boolean> {
    // создаём компонент вручную
    const ref = createComponent(ConfirmModalComponent, {
      environmentInjector: this.env,
      elementInjector: this.injector,
    });

    const hostEl = ref.location.nativeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.appendChild(hostEl);
    document.body.style.overflow = 'hidden'; // заблокировать скролл фона
    this.appRef.attachView(ref.hostView);

    // прокидываем значения в сигналы через setInput
    ref.setInput('title', opts.title ?? defaultConfirmModalOptions.title);
    ref.setInput('message', opts.message ?? defaultConfirmModalOptions.message);
    ref.setInput('confirmLabel', opts.confirmLabel ?? defaultConfirmModalOptions.confirmLabel);
    ref.setInput('discardLabel', opts.discardLabel ?? defaultConfirmModalOptions.discardLabel);
    ref.setInput('primaryButtonVariant', opts.danger ?? defaultConfirmModalOptions.danger ? 'danger': 'primary');

    // показать
    ref.changeDetectorRef.detectChanges();

    // функция очистки
    const cleanup = () => {
      try {
        this.appRef.detachView(ref.hostView);
      } catch {}
      try {
        ref.destroy();
      } catch {}
      document.body.style.overflow = prevOverflow;
    };

    // подписка на результат
    return ref.instance.closed.pipe(
      take(1),
      map((res) => !!res),
      finalize(cleanup)
    );
  }
}
