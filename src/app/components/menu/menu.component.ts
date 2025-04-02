// src/app/components/menu/menu.component.ts
import { Component, inject, signal, computed } from '@angular/core'; // Importa signal y computed
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './menu.component.html',
})
export class MenuComponent {
  cartService = inject(CartService);
  stateService = inject(StateService);
  selectedTable = this.stateService.selectedTable;

  // --- Estados para filtros ---
  searchTerm = signal(''); // Señal para el término de búsqueda
  selectedCategory = signal<string | null>('Todas'); // Señal para la categoría, 'Todas' por defecto

  // --- Datos ---
  products: Product[] = [
    // ... (tus productos con categorías asignadas como en el paso 1) ...
    { id: 1, name: 'Hamburguesa clásica', price: 10.00, imageUrl: 'https://placehold.co/600x400/E9D5FF/4D2C8B?text=Clasica', category: 'Hamburguesas' },
    { id: 2, name: 'Hamburguesa royal', price: 20.00, imageUrl: 'https://placehold.co/600x400/FBCFE8/831843?text=Royal', category: 'Hamburguesas' },
    { id: 3, name: 'Hamburguesa casera', price: 15.00, imageUrl: 'https://placehold.co/600x400/FEF08A/713F12?text=Casera', category: 'Hamburguesas' },
    { id: 4, name: 'Pizza Pepperoni', price: 25.00, imageUrl: 'https://placehold.co/600x400/FECACA/991B1B?text=Pizza', category: 'Pizzas' },
    { id: 5, name: 'Ensalada César', price: 18.00, imageUrl: 'https://placehold.co/600x400/A7F3D0/065F46?text=Ensalada', category: 'Ensaladas' },
    { id: 6, name: 'Agua Mineral', price: 3.00, imageUrl: 'https://placehold.co/600x400/BFDBFE/1E3A8A?text=Agua', category: 'Bebidas' },
    { id: 7, name: 'Gaseosa', price: 5.00, imageUrl: 'https://placehold.co/600x400/DDD6FE/4C1D95?text=Gaseosa', category: 'Bebidas' },
    { id: 8, name: 'Torta de Chocolate', price: 12.00, imageUrl: 'https://placehold.co/600x400/F5D0A9/7C2D12?text=Torta', category: 'Postres' },
  ];
  categories = ['Todas', ...new Set(this.products.map(p => p.category))];

  // --- Señal Computada para Productos Filtrados ---
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return this.products.filter(product => {
      // Filtrar por categoría (si no es 'Todas')
      const categoryMatch = category === 'Todas' || product.category === category;
      // Filtrar por término de búsqueda
      const termMatch = !term || product.name.toLowerCase().includes(term);
      // El producto debe cumplir ambas condiciones
      return categoryMatch && termMatch;
    });
  });

  // --- Métodos ---
  // Método actualizado para recibir producto y cantidad
  addToOrder(data: {product: Product, quantity: number}) {
    const { product, quantity } = data;
    // Llamamos al cartService con el producto y la cantidad
    this.cartService.addItem(product, quantity);
  }

  // Actualizar término de búsqueda desde el input
  updateSearchTerm(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm.set(inputElement.value);
  }

  // Seleccionar una categoría
  selectCategory(category: string | null) {
    this.selectedCategory.set(category);
  }
}