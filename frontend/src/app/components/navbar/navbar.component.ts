import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

/**
 * Reusable navbar:
 * - Brand at the left (replace text or slot logo)
 * - Links to Document, Author, Folder layouts (routerLink)
 * - Responsive burger on < 768 px
 * - Pure CSS; no Bootstrap / Material
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, NgOptimizedImage],
  styles: [`
  `],
  templateUrl: "./navbar.component.html",
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  open = false;
}
