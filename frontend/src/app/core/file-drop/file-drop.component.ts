// file-drop.component.ts
import { Component, EventEmitter, Input, Output, signal, HostListener } from '@angular/core';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-file-drop',
  standalone: true,
  templateUrl: 'file-drop.component.html',
  imports: [
    DecimalPipe
  ],
  styleUrl: 'file-drop.component.scss'
})
export class FileDropComponent {
  @Input() multiple = true;
  @Input() accept?: string;
  @Input() maxSizeMb = 50;
  @Input() placeholder = 'Перетащи файлы сюда или нажми, чтобы выбрать';

  @Output() changed = new EventEmitter<File[]>();

  readonly drag = signal(false);
  readonly files = signal<File[]>([]);

  hasFiles = () => this.files().length > 0;

  onFiles(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).filter(f => f.size <= this.maxSizeMb * 1024 * 1024);
    this.files.set(arr);
    this.changed.emit(arr);
  }

  onDragOver(e: DragEvent){ e.preventDefault(); this.drag.set(true); }
  onDragLeave(_e: DragEvent){ this.drag.set(false); }
  onDrop(e: DragEvent){
    e.preventDefault();
    this.drag.set(false);
    const fl = e.dataTransfer?.files ?? null;
    this.onFiles(fl);
  }
}
