import { Component, EventEmitter, Input, Output, signal, inject, OnInit, computed } from '@angular/core';
import { NgIf, NgTemplateOutlet } from '@angular/common'; // es-lint-disable-line
import { Guid } from 'guid-typescript';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CreateFolderDto, Folder, UpdateFolderDto } from '../core/features/folder/types/folder.types';
import { FOLDER_SERVICE } from '../core/features/folder/folder.service.token';

// --- Вспомогалки
const guidStr = (g: Guid | undefined | null) => g ? g.toString() : null;

@Component({
  selector: 'app-sidebar-tree',
  standalone: true,
  imports: [NgTemplateOutlet, NgIf],
  templateUrl: './app-sidebar-tree.component.html',
  styleUrl: './app-sidebar-tree.component.scss'
})
export class AppSidebarTreeComponent implements OnInit {
  // ---- Inputs/Outputs
  @Input() collapsed = false;
  @Output() selectFolder = new EventEmitter<Folder>();
  @Output() toggleCollapse = new EventEmitter<void>();

  // ---- DI
  private readonly svc = inject(FOLDER_SERVICE);

  // ---- State
  /** Плоский список, единственный источник правды */
  readonly flat = signal<Folder[]>([]);
  /** Открытые узлы (по id) */
  readonly openIds = signal(new Set<string>());
  /** Глобальный лоадер на первую загрузку */
  readonly loading = signal(false);

  /** Вычисляем дерево из плоского списка */
  readonly tree = computed(() => this.svc.buildTree(this.flat()));

  ngOnInit(): void {
    this.loadAll();
  }

  // ---- UI helpers
  trackById = (_: number, n: Folder) => guidStr(n.id)!;
  isOpen = (n: Folder) => this.openIds().has(guidStr(n.id)!);
  setOpen(n: Folder, on: boolean) {
    const s = new Set(this.openIds());
    const k = guidStr(n.id)!;
    on ? s.add(k) : s.delete(k);
    this.openIds.set(s);
  }

  toggle(n: Folder) {
    this.setOpen(n, !this.isOpen(n));
  }

  select(n: Folder) {
    this.selectFolder.emit(n);
  }

  // ---- CRUD
  async addChild(parent: Folder | null) {
    const title = prompt('Название новой папки');
    if (!title) return;

    const dto = new CreateFolderDto(title, undefined, parent?.id);
    const created = await firstValueFrom(
      this.svc.create(dto).pipe(
        catchError(err => { console.error(err); alert('Ошибка при создании'); return of(null); })
      )
    );
    if (!created) return;

    // Обновляем плоский список — дерево перестроится само
    this.flat.update(arr => [...arr, { ...created, children: [] }]);

    // Раскроем родителя, если есть
    if (parent && !this.isOpen(parent)) this.setOpen(parent, true);
  }

  async rename(node: Folder) {
    const next = prompt('Новое имя папки', node.title);
    if (!next || next === node.title) return;

    const dto = new UpdateFolderDto(next);
    await firstValueFrom(
      (this.svc as any).update(node.id, dto).pipe(
        catchError(err => { console.error(err); alert('Ошибка при переименовании'); return of(void 0); })
      )
    );

    this.flat.update(arr =>
      arr.map(f => guidStr(f.id) === guidStr(node.id) ? { ...f, title: next } : f)
    );
  }

  async remove(node: Folder, parent: Folder | null) {
    if (!confirm(`Удалить папку "${node.title}"?`)) return;

    await firstValueFrom(
      this.svc.delete(node.id).pipe(
        catchError(err => { console.error(err); alert('Ошибка при удалении'); return of(void 0); })
      )
    );

    const id = guidStr(node.id)!;
    this.flat.update(arr => arr.filter(f => guidStr(f.id) !== id));

    // закрыть id, если он был открыт
    const s = new Set(this.openIds());
    s.delete(id);
    this.openIds.set(s);
  }

  private async loadAll() {
    if (this.loading()) return;
    this.loading.set(true);
    try {
      const all = await firstValueFrom(
        this.svc.getAll().pipe(
          catchError(err => { console.error(err); alert('Ошибка загрузки папок'); return of<Folder[]>([]); })
        )
      );

      this.flat.set(all ?? []);
    } finally {
      this.loading.set(false);
    }
  }
}
