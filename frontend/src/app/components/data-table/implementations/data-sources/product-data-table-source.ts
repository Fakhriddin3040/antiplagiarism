import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {Page, TableDataSource, Query} from '../../types/table';

export type Category = 'Tech' | 'Clothes' | 'Food';

export interface Product {
  id: number;
  name: string;
  sku: string;
  category: Category;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string; // ISO (YYYY-MM-DD)
}

export function makeProducts(n = 120): Product[] {
  const cats: Category[] = ['Tech', 'Clothes', 'Food'];
  const start = new Date('2024-01-01').getTime();
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1,
    name: `Product #${i + 1}`,
    sku: `SKU-${1000 + i}`,
    category: cats[i % cats.length],
    price: +(Math.random() * 500 + 10).toFixed(2),
    stock: Math.floor(Math.random() * 200),
    active: i % 3 !== 0,
    createdAt: new Date(start + i * 86400000).toISOString().slice(0, 10),
  }));
}

export class ProductDataSource implements TableDataSource<Product> {
  constructor(private data: Product[]) {}

  removeByIds(ids: number[]) {
    this.data = this.data.filter(p => !ids.includes(p.id));
  }

  fetch(q: Query): Observable<Page<Product>> {
    let rows = [...this.data];

    // --- поисковая строка (глобальный поиск по name/sku)
    const s = (q.search ?? '').toLowerCase().trim();
    if (s) {
      rows = rows.filter(r =>
        r.name.toLowerCase().includes(s) || r.sku.toLowerCase().includes(s)
      );
    }

    // --- фильтры
    const f = q.filters ?? {};

    // category (eq)
    if (f['category']) {
      rows = rows.filter(r => r.category === f['category']);
    }

    // active (bool)
    if (typeof f['active'] === 'boolean') {
      rows = rows.filter(r => r.active === f['active']);
    }

    // createdAt_from / createdAt_to (date range — это уже поддержано твоим onFilterRangeChange)
    if (f['createdAt_from']) {
      rows = rows.filter(
        r => new Date(r.createdAt) >= new Date(String(f['createdAt_from']))
      );
    }
    if (f['createdAt_to']) {
      rows = rows.filter(
        r => new Date(r.createdAt) <= new Date(String(f['createdAt_to']))
      );
    }

    // --- сортировка (берём первый ключ)
    const sort0 = (q.sort ?? [])[0];
    if (sort0) {
      const dir = sort0.dir === 'desc' ? -1 : 1;
      const field = sort0.field as keyof Product;
      rows.sort((a: any, b: any) => {
        const av = a[field];
        const bv = b[field];
        if (av == null && bv == null) return 0;
        if (av == null) return -dir;
        if (bv == null) return dir;
        return av > bv ? dir : av < bv ? -dir : 0;
      });
    }

    // --- пагинация
    const size = q.size ?? 25;
    const page = q.page ?? 0;
    const total = rows.length;
    const items = rows.slice(page * size, page * size + size);

    // имитируем сеть
    return of({ items, total }).pipe(delay(300));
  }
}
