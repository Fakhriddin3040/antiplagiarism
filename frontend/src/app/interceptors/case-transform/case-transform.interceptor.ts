import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {CaseConverterService} from '../../core/http/case-converter.service';
import {SKIP_CASE_TRANSFORM, SKIP_REQUEST_TRANSFORM, SKIP_RESPONSE_TRANSFORM} from '../../core/http/case.tokens';

@Injectable()
export class CaseTransformInterceptor implements HttpInterceptor {
  constructor(private readonly conv: CaseConverterService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipAll = req.context.get(SKIP_CASE_TRANSFORM);
    const skipReq = skipAll || req.context.get(SKIP_REQUEST_TRANSFORM);
    const skipRes = skipAll || req.context.get(SKIP_RESPONSE_TRANSFORM);

    let newReq = req;

    if (!skipReq) {
      const contentType = req.headers.get('Content-Type') ?? '';
      const isMultipart = contentType.startsWith('multipart/form-data');
      const isOctet = contentType.startsWith('application/octet-stream');

      // Тело (не трогаем multipart/octet-stream)
      if (!isMultipart && !isOctet) {
        const transformedBody = this.conv.transformKeysDeep(req.body, true); // camel -> snake
        if (transformedBody !== req.body) {
          newReq = newReq.clone({ body: transformedBody });
        }
      }

      // Query params
      if (req.params) {
        const newParams = this.conv.transformParams(req.params, true); // camel -> snake
        if (newParams !== req.params) {
          newReq = newReq.clone({ params: newParams });
        }
      }
    }

    return next.handle(newReq).pipe(
      map((event) => {
        if (skipRes) return event;

        if (event instanceof HttpResponse) {
          const isJson = this.conv.isLikelyJson(event.headers.get('Content-Type'), event.body);
          if (isJson) {
            const transformed = this.conv.transformKeysDeep(event.body, false); // snake -> camel
            if (transformed !== event.body) {
              return event.clone({ body: transformed });
            }
          }
        }
        return event;
      })
    );
  }
}
