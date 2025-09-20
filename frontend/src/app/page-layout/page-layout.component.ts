import { Component, signal } from '@angular/core';
import {AppSidebarTreeComponent} from '../app-sidebar-tree/app-sidebar-tree.component';
import {Folder} from '../core/features/folder/types/folder.types';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-page-layout',
  standalone: true,
  imports: [
    AppSidebarTreeComponent,
    RouterOutlet
  ],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss'
})
export class PageLayoutComponent {
  collapsed = false;

  selectedNode = signal<Folder>(null!);

  onSelect(e: Folder) {
    this.selectedNode.set(e);
  }
  columns = [];
}
