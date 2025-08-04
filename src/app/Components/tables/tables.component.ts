import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [TableModule, CommonModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  @ViewChild('dt') table: Table | undefined;

  @Input() disablePagination: boolean = false;
  @Input() disableSearch: boolean = false;  
  @Input() headers: any[] = []; 
  @Input() tableInfo: any[] = []; 
  @Input() actions: any[] = [];  
  @Input() actionFunctions: { [key: string]: Function } = {}; 

  buscarTabla(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toLowerCase();
    if (this.table) {
      this.table.filterGlobal(valor, 'contains');
    }
  }

}
