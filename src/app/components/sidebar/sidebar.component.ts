// src/app/components/sidebar/sidebar.component.ts
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHouse, faUtensils, faCartShopping } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  stateService = inject(StateService);
  currentView = this.stateService.currentView;
  
  // Iconos
  faHouse = faHouse;
  faUtensils = faUtensils;
  faCartShopping = faCartShopping;
  
  // Control de menú móvil
  menuVisible = false;
  
  toggleMenu(): void {
    this.menuVisible = !this.menuVisible;
  }
  
  closeMenu(): void {
    this.menuVisible = false;
  }
}