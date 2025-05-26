import {Component, EventEmitter, HostListener, inject, Input, OnInit, Output} from '@angular/core';
import {FolderService} from '../../core/services/folder.service';
import {Folder, FolderRequest} from '../../core/models/folder.interface';
import {NgForOf} from '@angular/common';
import {FolderNodeComponent} from '../../folder-sidebar/folder-node/folder-node.component';
import {Guid} from 'guid-typescript';
import {findFolderInTree} from '../../helpers/functions/folder';
import {FolderModalComponent} from '../../folder-sidebar/folder-modal/folder-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalMode} from '../../core/abstracts/abstract-generic-modal';

@Component({
  selector: 'app-folder-sidebar',
  standalone: true,
  imports: [
    NgForOf,
    FolderNodeComponent
  ],
  templateUrl: './folder-sidebar.component.html',
  styleUrl: './folder-sidebar.component.scss'
})
export class FolderSidebarComponent implements OnInit {
  hidden: boolean = false;
  selectedFolder!: Folder;
  foldersTree!: Folder[]
  hoveredId?: Guid;

  @Output() folderSelected = new EventEmitter<Folder>();
  @Output() toggle = new EventEmitter<boolean>();

  folderService = inject(FolderService);
  modalService = inject(NgbModal);

  ngOnInit() {
    this.setFolders();
  }

  setFolders(): void {
    this.folderService.getTree()
      .subscribe({
        next: (folders) => this.foldersTree = folders,
        error: (error) => alert(`Error: ${error}`),
      })
  }

  onFolderSelect(folder: Folder): void {
    console.log("Folder selected");
    this.selectedFolder = folder;
    this.folderSelected.emit(folder);
  }

  toggleBar(): void {
    this.toggle.emit(this.hidden);
    this.hidden = !this.hidden;
  }

  onAdd(folder: Folder): void {
    console.log("Button 'Add' triggered")
    const modalRef = this.modalService.open(FolderModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
    })
    modalRef.componentInstance.mode = 'create';
    this.selectedFolder = folder;
    modalRef.componentInstance.submitted.subscribe((data: FolderRequest) => {
      this.handleModalCreate(data, modalRef.componentInstance.mode);
    });
  }

  onEdit(folder: Folder)   {
    const modalRef = this.modalService.open(FolderModalComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.mode = 'update';
    modalRef.componentInstance.initialData = {
      title: folder.title,
      description: folder?.description
    };
    modalRef.componentInstance.submitted.subscribe((data: FolderRequest) => {
      this.handleModalUpdate(data, folder);
      modalRef.close();
    });
  }
  onDelete(folder: Folder) {
    this.folderService.delete(folder.id)
      .subscribe({
        next: () => {
          this.removeFolderFromTree(folder)
        },
        error: (error) => {
          alert(`Error deleting folder with id ${folder.id}. The error: ${error}`);
          throw error;
        },
      })
  }

  onHover(folder: Folder): void {
    this.hoveredId = folder.id;
  }

  removeFolderFromTree(folder: Folder): void {
    if(!folder.parentId) {
      this.foldersTree.splice(this.foldersTree.indexOf(folder), 1);
      return;
    }
    const parentFolder = findFolderInTree(this.foldersTree, folder.parentId);
    parentFolder!.children!.splice(parentFolder!.children!.indexOf(folder), 1);
  }

  // #REGION Modal window

  handleModalCreate(data: FolderRequest, parent: Folder): void {
    data.parentId = parent.id;
    this.folderService.create(data)
      .subscribe({
        next: (folder) => {
          parent!.children!.push(folder);
        },
        error: (error) => alert(`Error creating folder. The error: ${error.message}`),
      })
  }

  handleModalUpdate(data: FolderRequest, folder: Folder): void {
    this.folderService.update(folder.id, data)
      .subscribe({
        next: (folder) => {
          const index = folder.children!.indexOf(folder);
          folder.children![index] = folder;
        },
        error: (error) => alert(`Error updating folder. The error: ${error.message}`),
      })
  }

  @HostListener('mouseleave')
  onHoverOut(): void {
    this.hoveredId = undefined;
  }
}
