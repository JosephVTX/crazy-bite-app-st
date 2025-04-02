// src/app/components/cart/cart.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service'; // Asegúrate que esté importado
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  stateService = inject(StateService);
  cartService = inject(CartService);

  selectedTable = this.stateService.selectedTable;
  cartItems = this.cartService.cartItems;
  totalPrice = this.cartService.totalPrice;

  removeItemFromCart(productId: number) {
    this.cartService.removeItem(productId);
  }

  clearCurrentCart() {
    this.cartService.clearCart();
  }

  // Método para aumentar la cantidad de un producto
  increaseItemQuantity(productId: number) {
    const currentCart = this.cartItems();
    const itemIndex = currentCart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const updatedCart = [...currentCart];
      updatedCart[itemIndex] = {
        ...updatedCart[itemIndex],
        quantity: updatedCart[itemIndex].quantity + 1
      };
      this.cartService.cartItems.set(updatedCart);
    }
  }

  // Método para disminuir la cantidad de un producto
  decreaseItemQuantity(productId: number) {
    const currentCart = this.cartItems();
    const itemIndex = currentCart.findIndex(item => item.id === productId);
    
    if (itemIndex > -1) {
      const updatedCart = [...currentCart];
      
      if (updatedCart[itemIndex].quantity > 1) {
        // Si hay más de 1, reducir la cantidad
        updatedCart[itemIndex] = {
          ...updatedCart[itemIndex],
          quantity: updatedCart[itemIndex].quantity - 1
        };
        this.cartService.cartItems.set(updatedCart);
      } else {
        // Si solo hay 1, eliminar el item
        this.removeItemFromCart(productId);
      }
    }
  }

  // Método para confirmar el pedido
  confirmOrder() {
    const table = this.selectedTable();
    const items = this.cartItems();
    const total = this.totalPrice();

    if (table !== null && items.length > 0) {
      // 1. Añadir el pedido al StateService
      this.stateService.addOrder(table, items, total);
      // 2. Limpiar el carrito actual
      this.cartService.clearCart();
      // 3. Cambiar a la vista de 'orders'
      this.stateService.viewOrders();
    } else {
      console.error('No se puede confirmar el pedido: falta mesa o items.');
      // Opcional: Mostrar mensaje al usuario
    }
  }
}