import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-price-becerros',
  templateUrl: './price-becerros.page.html',
  styleUrls: ['./price-becerros.page.scss'],
})
export class PriceBecerrosPage implements OnInit {
  data: { id?: string; peso: string; precio: string; numero2: string; cn: string }[] = []; // Array de datos

  constructor(private router: Router, private firestore: AngularFirestore) {}

  ngOnInit() {
    // Recuperar los datos de Firebase al cargar la página
    this.firestore
      .collection('becerros') // Asegúrate de que 'becerros' es el nombre de la colección correcta
      .valueChanges({ idField: 'id' }) // Incluye el ID del documento
      .subscribe((data: any) => {
        this.data = data;
        console.log('Datos cargados de Firebase:', this.data);
      });
  }

  // Método para agregar una nueva fila
  addRow() {
    const nuevaFila = { peso: '', precio: '', numero2: '', cn: '' };
    this.firestore
      .collection('becerros') // Reemplaza 'becerros' con tu colección
      .add(nuevaFila)
      .then((docRef) => {
        console.log('Fila agregada con ID:', docRef.id);
      })
      .catch((error) => {
        console.error('Error al agregar fila:', error);
      });
  }

  // Método para eliminar una fila
  removeRow(index: number) {
    const id = this.data[index].id; // ID del documento en Firebase
    if (id) {
      this.firestore
        .collection('becerros')
        .doc(id)
        .delete()
        .then(() => {
          console.log('Fila eliminada con ID:', id);
        })
        .catch((error) => {
          console.error('Error al eliminar fila:', error);
        });
    }
  }

  // Método para guardar cambios en una fila
  saveRow(index: number) {
    const id = this.data[index].id; // ID del documento en Firebase
    const updatedData = {
      peso: this.data[index].peso,
      precio: this.data[index].precio,
      numero2: this.data[index].numero2,
      cn: this.data[index].cn,
    };

    if (id) {
      this.firestore
        .collection('becerros')
        .doc(id)
        .update(updatedData)
        .then(() => {
          console.log('Fila actualizada con ID:', id);
        })
        .catch((error) => {
          console.error('Error al actualizar fila:', error);
        });
    }
  }

  // Navegar a la página anterior
  goBack() {
    this.router.navigate(['/rancho-detail']);
  }

  // trackBy para mejorar el rendimiento de las filas
  trackByIndex(index: number): number {
    return index; // Seguimiento por índice
  }
}
