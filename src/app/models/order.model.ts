// src/app/models/order.model.ts
import { CartItem } from '../services/cart.service';

export type OrderStatus = 'recibido' | 'preparacion' | 'listo';

export interface Order {
    id: number; // Identificador único del pedido
    tableNumber: number;
    items: CartItem[];
    totalPrice: number;
    status: OrderStatus;
    createdAt: number; // Timestamp para saber cuándo se creó
    statusUpdatedAt: number; // Timestamp para saber cuándo se actualizó el estado
}