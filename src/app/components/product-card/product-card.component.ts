// src/app/components/product-card/product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';
import { CommonModule } from '@angular/common'; // Importar CommonModule para ngIf, ngFor, etc.
import { FormsModule } from '@angular/forms'; // Añadimos FormsModule para [(ngModel)]

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, FormsModule], // Añadimos FormsModule
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  // Recibe el producto como entrada desde el componente padre (MenuComponent)
  @Input({ required: true }) product!: Product;
  // Emite un evento cuando se hace clic en "Ordenar"
  @Output() addToCart = new EventEmitter<{product: Product, quantity: number}>();
  
  quantity: number = 1; // Cantidad predeterminada

  // Método para aumentar la cantidad
  increaseQuantity(): void {
    this.quantity++;
  }

  // Método para disminuir la cantidad
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onOrderClick() {
    // Emite el producto actual y la cantidad cuando se hace clic en el botón
    this.addToCart.emit({product: this.product, quantity: this.quantity});
    this.quantity = 1; // Reiniciar la cantidad después de agregar
  }
}