// src/app/services/cart.service.ts
import { Injectable, signal, effect, computed } from '@angular/core';
import { Product } from '../models/product.model'; // Crearemos este modelo

// Interfaz para un item en el carrito (podría incluir cantidad)
export interface CartItem extends Product {
  quantity: number;
}

const LOCAL_STORAGE_KEY = 'crazyBiteCart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Signal para los items del carrito
  cartItems = signal<CartItem[]>(this.loadCartFromLocalStorage());

  // Efecto para guardar en localStorage cada vez que el carrito cambie
  private saveCartEffect = effect(() => {
    this.saveCartToLocalStorage(this.cartItems());
  });

  // Calcula el total de items (no productos únicos)
  itemCount = computed(() => this.cartItems().reduce((sum, item) => sum + item.quantity, 0));

  // Calcula el precio total
  totalPrice = computed(() => this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0));


  addItem(product: Product, quantity: number = 1) {
    const currentCart = this.cartItems();
    const existingItemIndex = currentCart.findIndex(item => item.id === product.id);

    if (existingItemIndex > -1) {
      // Si el producto ya existe, incrementa la cantidad
      const updatedCart = [...currentCart]; // Crear copia para inmutabilidad
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + quantity
      };
      this.cartItems.set(updatedCart);
    } else {
      // Si es un producto nuevo, agrégalo con la cantidad especificada
      this.cartItems.set([...currentCart, { ...product, quantity }]);
    }
  }

  removeItem(productId: number) {
    this.cartItems.set(this.cartItems().filter(item => item.id !== productId));
  }

  clearCart() {
    this.cartItems.set([]);
  }

  // Carga el carrito desde localStorage al iniciar
  private loadCartFromLocalStorage(): CartItem[] {
    if (typeof localStorage !== 'undefined') { // Verifica si localStorage está disponible
      const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  }

  // Guarda el carrito en localStorage
  private saveCartToLocalStorage(cart: CartItem[]) {
    if (typeof localStorage !== 'undefined') { // Verifica si localStorage está disponible
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
      console.log('Carrito guardado en localStorage:', cart);
    }
  }
}