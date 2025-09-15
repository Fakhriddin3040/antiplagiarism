import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Page, Query, TableDataSource } from '../../types/table';

export type Category = { id: number; name: string };

export interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  category: string;         // денормализация для удобства отображения
  price: number;            // в у.е.
  active: boolean;
  createdAt: string;        // ISO
  asset?: File
}

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Tech' },
  { id: 2, name: 'Clothes' },
  { id: 3, name: 'Food' },
];

const pick = <T>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];

export function makeProducts(count = 120): Product[] {
  const out: Product[] = [];
  for (let i = 1; i <= count; i++) {
    const cat = pick(CATEGORIES);
    const price = Math.round((Math.random() * 950 + 50) * 100) / 100;
    const daysAgo = Math.floor(Math.random() * 365);
    const createdAt = new Date(Date.now() - daysAgo * 86400000).toISOString();

    out.push({
      id: i,
      name: `Product ${i}`,
      sku: `SKU-${String(i).padStart(4, '0')}`,
      categoryId: cat.id,
      category: cat.name,
      price,
      active: Math.random() > 0.3,
      createdAt,
    });
  }
  return out;
}

export class ProductDataSource implements TableDataSource<Product> {
  private data: Product[];

  constructor(seed: Product[]) {
    this.data = seed;
  }

  /** для SmartSelect — ищем категории, возвращаем элементы (id строго уходит наружу) */
  searchCategories = (term: string): Observable<Category[]> => {
    const t = (term ?? '').toLowerCase().trim();
    const res = !t
      ? CATEGORIES
      : CATEGORIES.filter(c => c.name.toLowerCase().includes(t));
    return of(res).pipe(delay(200));
  };

  removeByIds(ids: number[]) {
    const set = new Set(ids);
    this.data = this.data.filter(p => !set.has(p.id));
  }

  fetch(q: Query): Observable<Page<Product>> {
    // 1) фильтрация
    let rows = [...this.data];

    // глобальный поиск
    const search = (q.search ?? '').toLowerCase().trim();
    if (search) {
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(search) ||
        r.sku.toLowerCase().includes(search) ||
        r.category.toLowerCase().includes(search)
      );
    }

    // нормализованные фильтры
    const f = q.filters ?? {};
    // categoryId (из SmartSelect шлём id)
    if (f['categoryId'] != null && f['categoryId'] !== '') {
      const id = Number(f['categoryId']);
      rows = rows.filter(r => r.categoryId === id);
    }
    // только активные
    if (f['active'] === true) {
      rows = rows.filter(r => r.active === true);
    }
    // sku text (пример like)
    if (typeof f['sku'] === 'string' && f['sku'].trim()) {
      const s = f['sku'].toLowerCase().trim();
      rows = rows.filter(r => r.sku.toLowerCase().includes(s));
    }
    // createdAt range
    const from = f['createdAt_from'] ? new Date(String(f['createdAt_from'])) : null;
    const to   = f['createdAt_to']   ? new Date(String(f['createdAt_to']))   : null;
    if (from) rows = rows.filter(r => new Date(r.createdAt) >= from);
    if (to)   rows = rows.filter(r => new Date(r.createdAt) <= to);

    // 2) сортировка (берём первый критерий)
    const s = (q.sort ?? [])[0];
    if (s?.field) {
      const dir = s.dir === 'desc' ? -1 : 1;
      const key = s.field as keyof Product;
      rows.sort((a, b) => {
        const va = a[key] as any, vb = b[key] as any;
        if (va == null && vb == null) return 0;
        if (va == null) return -1 * dir;
        if (vb == null) return 1 * dir;

        // даты/числа/строки
        const na = typeof va === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(va) ? +new Date(va) : va;
        const nb = typeof vb === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(vb) ? +new Date(vb) : vb;

        if (na < nb) return -1 * dir;
        if (na > nb) return  1 * dir;
        return 0;
      });
    }

    // 3) пагинация
    const size = q.size ?? 25;
    const page = q.page ?? 0;
    const start = page * size;
    const items = rows.slice(start, start + size);
    const total = rows.length;

    return of({ items, total }).pipe(delay(250));
  }
}
