// src/app/app.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Importa los componentes necesarios
import { StateService, AppView } from './services/state.service'; // Importa AppView
import { TableSelectionComponent } from './components/table-selection/table-selection.component';
import { MenuComponent } from './components/menu/menu.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderStatusComponent } from './components/order-status/order-status.component'; // Importa el nuevo componente
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { CartService } from './services/cart.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    TableSelectionComponent,
    MenuComponent,
    SidebarComponent,
    CartComponent,
    OrderStatusComponent, // Añade OrderStatusComponent a las importaciones
    FontAwesomeModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stateService = inject(StateService);
  cartService = inject(CartService);

  // Obtener las señales directamente del servicio
  currentView = this.stateService.currentView;
  selectedTable = this.stateService.selectedTable;
  cartItemCount = this.cartService.itemCount;
  
  // Icono de carrito
  faCartShopping = faCartShopping;
  
  // Control del carrito en versión móvil
  showCartMobile = false;
  
  toggleCartMobile(): void {
    this.showCartMobile = !this.showCartMobile;
  }
}