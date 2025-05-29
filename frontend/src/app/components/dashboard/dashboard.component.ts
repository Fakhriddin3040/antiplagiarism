import {Component} from '@angular/core';
import {FolderSidebarComponent} from '../folder-sidebar/folder-sidebar.component';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from '../navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    FolderSidebarComponent,
    RouterOutlet,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  sidebarOpen: boolean = true;
}
