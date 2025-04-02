// src/app/components/table-selection/table-selection.component.ts
import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-selection.component.html',
})
export class TableSelectionComponent {
  stateService = inject(StateService);
  tables = Array.from({ length: 9 }, (_, i) => i + 1); // Genera números del 1 al 9

  selectThisTable(tableNumber: number) {
    this.stateService.selectTable(tableNumber);
  }
}