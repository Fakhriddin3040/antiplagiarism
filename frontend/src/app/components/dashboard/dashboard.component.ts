import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {FolderSidebarComponent} from '../folder-sidebar/folder-sidebar.component';
import {DocumentLayoutComponent} from '../document-layout/document-layout.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FolderSidebarComponent,
    DocumentLayoutComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  sidebarOpen: boolean = true;
}
