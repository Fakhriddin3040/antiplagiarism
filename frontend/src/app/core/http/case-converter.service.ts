import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';

type Dict = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class CaseConverterService {
  camelToSnake(s: string): string {
    return s.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
  }

  snakeToCamel(s: string): string {
    return s.replace(/_+([a-zA-Z])/g, (_, c: string) => c.toUpperCase());
  }

  private isPlainObject(val: any): val is Dict {
    return Object.prototype.toString.call(val) === '[object Object]';
  }

  private shouldSkipBody(val: any): boolean {
    return (
      val == null ||
      typeof val !== 'object' ||
      val instanceof Date ||
      val instanceof Blob ||
      val instanceof File ||
      val instanceof ArrayBuffer ||
      val instanceof URLSearchParams ||
      (typeof FormData !== 'undefined' && val instanceof FormData)
    );
  }

  /** Рекурсивная конверсия ключей объектов/массивов */
  transformKeysDeep(input: any, toSnake: boolean, seen = new WeakMap<object, any>()): any {
    if (this.shouldSkipBody(input)) return input;

    if (Array.isArray(input)) {
      const out = new Array(input.length);
      for (let i = 0; i < input.length; i++) {
        out[i] = this.transformKeysDeep(input[i], toSnake, seen);
      }
      return out;
    }

    if (this.isPlainObject(input)) {
      if (seen.has(input)) return seen.get(input);
      const out: Dict = {};
      seen.set(input, out);

      for (const [k, v] of Object.entries(input)) {
        const nk = toSnake ? this.camelToSnake(k) : this.snakeToCamel(k);
        out[nk] = this.transformKeysDeep(v, toSnake, seen);
      }
      return out;
    }

    return input;
  }

  /** Перекладываем HttpParams в новый с конвертацией ключей */
  transformParams(params: HttpParams, toSnake: boolean): HttpParams {
    if (!params || params.keys().length === 0) return params;
    // Сохраним энкодер (если кастомный)
    const encoder = (params as any).encoder;
    let next = new HttpParams({ encoder });

    for (const key of params.keys()) {
      const values = params.getAll(key) ?? [];
      const nk = toSnake ? this.camelToSnake(key) : this.snakeToCamel(key);
      for (const v of values) next = next.append(nk, v);
    }
    return next;
  }

  isLikelyJson(contentTypeHeader: string | null, body: unknown): boolean {
    if (body == null) return false;
    const ct = contentTypeHeader ?? '';
    return ct.includes('application/json') || typeof body === 'object';
  }
}
