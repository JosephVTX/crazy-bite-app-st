// src/app/components/order-status/order-status.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateService } from '../../services/state.service';
import { Order, OrderStatus } from '../../models/order.model'; // Asegúrate que OrderStatus esté exportado
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck, faReceipt, faUtensils, faBell, faClock, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-status',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './order-status.component.html',
  styles: [`
    .progress-animate {
      background-size: 30px 30px;
      background-image: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.25) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.25) 75%,
        transparent 75%,
        transparent
      );
      animation: animate-stripes 0.7s linear infinite;
    }
    
    .pulse-animation {
      animation: pulse 1s infinite;
    }
    
    @keyframes animate-stripes {
      0% { background-position: 0 0; }
      100% { background-position: 60px 0; }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.05); }
    }
  `]
})
export class OrderStatusComponent {
  stateService = inject(StateService);
  activeOrders = this.stateService.activeOrders; // Obtener la señal de pedidos activos
  
  // Iconos
  faCheck = faCheck;
  faReceipt = faReceipt;
  faUtensils = faUtensils;
  faBell = faBell;
  faClock = faClock;
  faTrashAlt = faTrashAlt;

  // Helper para obtener clases CSS según el estado para los indicadores
  getStatusClass(orderStatus: OrderStatus, step: OrderStatus): string {
    const statusHierarchy: OrderStatus[] = ['recibido', 'preparacion', 'listo'];
    const orderIndex = statusHierarchy.indexOf(orderStatus);
    const stepIndex = statusHierarchy.indexOf(step);

    if (orderIndex >= stepIndex) {
      return 'completed'; // El pedido ha alcanzado o superado este paso
    } else if (orderIndex === stepIndex - 1) {
      return 'current'; // El pedido está justo antes de este paso (opcional, podrías quererlo resaltar)
    }
    return 'pending'; // El pedido aún no ha llegado a este paso
  }

  // Helper para formatear la hora
  formatTime(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Método para eliminar un pedido (útil para limpiar pedidos 'listos')
  removeThisOrder(orderId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido de la lista?')) {
      this.stateService.removeOrder(orderId);
    }
  }

  // Método para calcular el porcentaje de progreso
  getProgressPercentage(order: Order): number {
    // Si está listo, mostrar 100%
    if (order.status === 'listo') {
      return 100;
    }
    
    // Calcular el progreso basado en el tiempo transcurrido total
    const totalProcessTime = 9000; // 9 segundos en total
    const elapsedTime = Date.now() - order.createdAt;
    
    // Calcular el porcentaje de progreso en base al tiempo transcurrido
    const progressPercentage = Math.min(99, (elapsedTime / totalProcessTime) * 100);
    return progressPercentage;
  }

  // Método para estimar el tiempo total hasta que el pedido esté listo
  getEstimatedTime(order: Order): string {
    if (order.status === 'listo') {
      return '0';
    }
    
    // El tiempo estimado total es de 9 segundos
    const estimatedTotalTime = 9; // 9 segundos en total
    const elapsedTime = (Date.now() - order.createdAt) / 1000;
    const remainingSeconds = Math.max(0, estimatedTotalTime - elapsedTime);
    
    return Math.ceil(remainingSeconds).toString();
  }
}