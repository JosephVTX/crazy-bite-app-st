// src/app/services/state.service.ts
import { Injectable, signal, OnDestroy } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';
import { CartItem } from './cart.service';

// Tipos para las vistas posibles
export type AppView = 'tables' | 'menu' | 'orders' | 'login';

@Injectable({
  providedIn: 'root'
})
export class StateService implements OnDestroy {
  // Señal para la vista actual
  currentView = signal<AppView>('tables');
  // Señal para la mesa seleccionada
  selectedTable = signal<number | null>(null);
  // Señal para los pedidos activos
  activeOrders = signal<Order[]>(this.loadOrdersFromLocalStorage()); // Cargar pedidos al inicio

  // Almacenar los IDs de los timeouts para poder limpiarlos
  private statusUpdateTimers: { [orderId: number]: any } = {}; // any para setTimeout ID

  ngOnDestroy(): void {
    // Limpiar todos los timeouts pendientes cuando el servicio se destruye
    Object.values(this.statusUpdateTimers).forEach(clearTimeout);
    console.log('StateService destruido, timeouts limpiados.');
  }

  selectTable(tableNumber: number) {
    this.selectedTable.set(tableNumber);
    this.currentView.set('menu'); // Cambiar a la vista de menú
    console.log(`Mesa seleccionada: ${tableNumber}, mostrando menú.`);
  }

  clearTableSelection() {
    this.selectedTable.set(null);
    this.currentView.set('tables'); // Volver a la selección de mesas
    console.log('Selección de mesa limpiada.');
  }

  viewOrders() {
    this.currentView.set('orders'); // Cambiar a la vista de pedidos
    console.log('Mostrando vista de pedidos.');
  }

  // Añade un nuevo pedido
  addOrder(table: number, items: CartItem[], total: number) {
    const newOrder: Order = {
      id: Date.now(), // ID simple basado en timestamp
      tableNumber: table,
      items: items,
      totalPrice: total,
      status: 'recibido', // Estado inicial
      createdAt: Date.now(),
      statusUpdatedAt: Date.now() // Añadir el timestamp de actualización de estado
    };

    // Actualizar la señal de pedidos activos de forma inmutable
    this.activeOrders.update(orders => [...orders, newOrder]);
    this.saveOrdersToLocalStorage(); // Guardar después de añadir
    console.log(`Nuevo pedido añadido para mesa ${table}:`, newOrder);
    // Iniciar la simulación de actualización de estado para este nuevo pedido
    this._scheduleNextStatusUpdate(newOrder.id);
  }

  // --- Simulación de actualización de estado ---

  private _scheduleNextStatusUpdate(orderId: number) {
    // Limpiar timer anterior si existía para este pedido
    if (this.statusUpdateTimers[orderId]) {
      clearTimeout(this.statusUpdateTimers[orderId]);
    }

    const order = this.activeOrders().find(o => o.id === orderId);
    if (!order || order.status === 'listo') {
      delete this.statusUpdateTimers[orderId]; // Limpiar referencia si está listo o no existe
      return; // No programar más actualizaciones si el pedido está listo o no se encuentra
    }

    // Tiempo fijo para la próxima actualización - 4.5 segundos (proceso completo = 9 segundos)
    const fixedDelay = 4500;

    console.log(`Pedido ${orderId}: Próxima actualización de estado (${order.status}) en ${fixedDelay / 1000}s`);

    this.statusUpdateTimers[orderId] = setTimeout(() => {
      this._advanceOrderStatus(orderId);
    }, fixedDelay);
  }

  private _advanceOrderStatus(orderId: number) {
    let orderFound = false;
    this.activeOrders.update(orders => {
      return orders.map(order => {
        if (order.id === orderId) {
          orderFound = true;
          let nextStatus: OrderStatus = order.status;
          if (order.status === 'recibido') {
            nextStatus = 'preparacion';
          } else if (order.status === 'preparacion') {
            nextStatus = 'listo';
          }
          console.log(`Pedido ${orderId}: Estado cambiado de ${order.status} a ${nextStatus}`);
          return { 
            ...order, 
            status: nextStatus,
            statusUpdatedAt: Date.now() // Actualizar el timestamp cuando cambia el estado
          };
        }
        return order;
      });
    });

    this.saveOrdersToLocalStorage(); // Guardar después de actualizar

    // Si encontramos y actualizamos el pedido, programar la siguiente actualización si no está 'listo'
    if (orderFound) {
      const updatedOrder = this.activeOrders().find(o => o.id === orderId);
      if (updatedOrder && updatedOrder.status !== 'listo') {
        this._scheduleNextStatusUpdate(orderId); // Reprogramar
      } else {
        delete this.statusUpdateTimers[orderId]; // Limpiar timer si ya está listo
        console.log(`Pedido ${orderId} está listo. No más actualizaciones programadas.`);
      }
    } else {
      delete this.statusUpdateTimers[orderId]; // Limpiar si el pedido ya no existe
    }
  }

  // --- Persistencia de Pedidos (Opcional pero útil) ---
  private saveOrdersToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crazyBiteOrders', JSON.stringify(this.activeOrders()));
    }
  }

  private loadOrdersFromLocalStorage(): Order[] {
    if (typeof localStorage !== 'undefined') {
      const storedOrders = localStorage.getItem('crazyBiteOrders');
      let orders: Order[] = [];
      
      try {
        orders = storedOrders ? JSON.parse(storedOrders) : [];
        
        // Validar que cada orden tenga la estructura correcta
        orders = orders.filter(order => 
          order && 
          typeof order === 'object' && 
          typeof order.id === 'number' && 
          typeof order.status === 'string'
        );
        
        // Reprogramar actualizaciones para pedidos no 'listos' al cargar
        orders.forEach(order => {
          if (order.status !== 'listo') {
            this._scheduleNextStatusUpdate(order.id);
          }
        });
      } catch (error) {
        console.error('Error al cargar pedidos del localStorage:', error);
        // Si hay un error al parsear, devolver un array vacío
        orders = [];
        // Limpiar el localStorage corrupto
        localStorage.removeItem('crazyBiteOrders');
      }
      
      return orders;
    }
    return [];
  }

  // Podrías añadir una función para eliminar pedidos 'listos' después de un tiempo
  // o manualmente.
  removeOrder(orderId: number) {
    this.activeOrders.update(orders => orders.filter(o => o.id !== orderId));
    if (this.statusUpdateTimers[orderId]) {
      clearTimeout(this.statusUpdateTimers[orderId]);
      delete this.statusUpdateTimers[orderId];
    }
    this.saveOrdersToLocalStorage();
    console.log(`Pedido ${orderId} eliminado.`);
  }
}