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
    { id: 1, name: 'Hamburguesa clásica', price: 10.00, imageUrl: 'https://www.serargentino.com/public/images/2021/01/16109941330-17-burger-773x458.jpg', category: 'Hamburguesas' },
    { id: 2, name: 'Hamburguesa royal', price: 20.00, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPPSYgqsbNkYUr7X9CAhkWcb_7WMmfu4nj_Q&s', category: 'Hamburguesas' },
    { id: 3, name: 'Hamburguesa casera', price: 15.00, imageUrl: 'https://media.istockphoto.com/id/635875304/es/foto/hamburguesa-aislada-sobre-fondo-blanco.jpg?s=612x612&w=0&k=20&c=5N_Tn6mNQ1NLJNx_o68VdWtq3rkxKneF7FBz9mfUNG8=', category: 'Hamburguesas' },
    { id: 4, name: 'Pizza Pepperoni', price: 25.00, imageUrl: 'https://assets-us-01.kc-usercontent.com/4353bced-f940-00d0-8c6e-13a0a4a7f5c2/2ac60829-5178-4a6e-80cf-6ca43d862cee/Quick-and-Easy-Pepperoni-Pizza-700x700.jpeg?w=1280&auto=format', category: 'Pizzas' },
    { id: 5, name: 'Ensalada César', price: 18.00, imageUrl: 'https://www.goodnes.com/sites/g/files/jgfbjl321/files/srh_recipes/755f697272cbcdc6e5df2adb44b1b705.jpg', category: 'Ensaladas' },
    { id: 6, name: 'Agua Mineral', price: 3.00, imageUrl: 'https://socialdrinks.pe/wp-content/uploads/2022/04/1313_BE00000051.jpeg', category: 'Bebidas' },
    { id: 7, name: 'Gaseosa', price: 5.00, imageUrl: 'https://metroio.vtexassets.com/arquivos/ids/237646/517411-01-4644.jpg?v=638173813436870000', category: 'Bebidas' },
    { id: 8, name: 'Torta de Chocolate', price: 12.00, imageUrl: 'https://patty.pe/wp-content/uploads/2021/06/MINI-CHOCOLATE.png', category: 'Postres' },
    { id: 9, name: 'Pizza Americana', price: 23.00, imageUrl: 'https://mandolina.co/wp-content/uploads/2023/08/pizza-americana-1200x900.jpg', category: 'Pizzas' },
    { id: 10, name: 'Pizza Hawaiana', price: 22.00, imageUrl: 'https://www.cocinadelirante.com/sites/default/files/images/2019/11/como-hacer-pizza-hawaiana.jpg', category: 'Pizzas' },
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