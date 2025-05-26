import {Component, EventEmitter, Host, HostListener, inject, Input, Output} from '@angular/core';
import {Folder} from '../../core/models/folder.interface';
import {FolderService} from '../../core/services/folder.service';
import {NgForOf, NgIf} from '@angular/common';
import {expand} from 'rxjs';
import {Guid} from 'guid-typescript';

@Component({
  selector: 'li[app-folder-node]',
  standalone: true,
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './folder-node.component.html',
  styleUrl: './folder-node.component.scss'
})
export class FolderNodeComponent {
  @Input() folder!: Folder;
  @Input() level!: number;
  @Input() selectedFolderId?: Guid;
  @Input() hoveredId?: Guid;


  @Output() hoverIn = new EventEmitter<Folder>();
  @Output() hoverOut = new EventEmitter<Folder>();

  @Output() folderSelected = new EventEmitter<Folder>();

  @Output() actionAdd      = new EventEmitter<Folder>();
  @Output() actionEdit     = new EventEmitter<Folder>();
  @Output() actionDelete   = new EventEmitter<Folder>();

  loading: boolean = false;
  isExpanded: boolean = false;

  folderService = inject(FolderService);

  selectFolder(event: MouseEvent): void {
    event.stopImmediatePropagation();
    this.folderSelected.emit(this.folder);
  }

  toggleBranch(event: MouseEvent): void {
    event.stopPropagation();
    this.isExpanded = !this.isExpanded;
  }

  addChild(e: Event)  { e.stopPropagation(); this.actionAdd.emit(this.folder); }
  editSelf(e: Event)  { e.stopPropagation(); this.actionEdit.emit(this.folder); }
  deleteSelf(e: Event){ e.stopPropagation(); this.actionDelete.emit(this.folder); }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.hoverIn.emit(this.folder);
  }

  @HostListener(' mouseleave')
  onMouseLeave(): void {
    this.hoverOut.emit(this.folder);
  }
}
