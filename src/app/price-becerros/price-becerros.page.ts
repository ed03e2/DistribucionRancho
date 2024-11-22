import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-price-becerros',
  templateUrl: './price-becerros.page.html',
  styleUrls: ['./price-becerros.page.scss'],
})
export class PriceBecerrosPage implements OnInit {

  data: { peso: string, precio: string, numero2: string, cn: string }[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    // Recuperar datos desde el localStorage si existen
    const storedData = localStorage.getItem('becerrosData');
    if (storedData) {
      this.data = JSON.parse(storedData);
    }
  }

  // Método para agregar una nueva fila
  addRow() {
    this.data.push({ peso: '', precio: '', numero2: '', cn: '' });
    this.saveDataToLocalStorage();
  }

  // Método para eliminar una fila
  removeRow(index: number) {
    this.data.splice(index, 1);
    this.saveDataToLocalStorage();
  }

  // Guardar los datos en localStorage
  saveDataToLocalStorage() {
    console.log("Guardando datos en el localStorage:", this.data); // Verificar los datos antes de guardarlos
    localStorage.setItem('becerrosData', JSON.stringify(this.data));
  }

  // Ir atrás a la página anterior
  goBack() {
    this.router.navigate(['/rancho-detail']);
  }

  // trackBy para mejorar el rendimiento y evitar reinicios de la página
  trackByIndex(index: number, item: any): number {
    return index;  // Utiliza el índice para el seguimiento
  }
}
