import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../service/auth.service';// Asegúrate de que existe este servicio

@Component({
  selector: 'app-price-becerros',
  templateUrl: './price-becerros.page.html',
  styleUrls: ['./price-becerros.page.scss'],
})
export class PriceBecerrosPage implements OnInit {
  data: { id?: string; peso: string; precio: string; numero2: string; cn: string }[] = [];
  isAdmin: boolean = false; // Propiedad para controlar permisos

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private authService: AuthService // Inyecta el servicio de autenticación
  ) {}

  ngOnInit() {
    // Recuperar los datos de Firebase al cargar la página
    this.firestore
      .collection('becerros')
      .valueChanges({ idField: 'id' })
      .subscribe((data: any) => {
        this.data = data;
        console.log('Datos cargados de Firebase:', this.data);
      });

    // Obtener el rol del usuario
    const uid = this.authService.getUserUid();
    this.authService.getUserRole(uid).then(
      (role) => {
        this.isAdmin = role === 'admin'; // Cambiar según el rol requerido
        console.log('¿Es administrador?', this.isAdmin);
      },
      (error) => {
        console.error('Error al obtener el rol:', error);
      }
    );
  }

  addRow() {
    if (!this.isAdmin) {
      console.warn('No tienes permisos para agregar filas.');
      return;
    }

    const nuevaFila = { peso: '', precio: '', numero2: '', cn: '' };
    this.firestore
      .collection('becerros')
      .add(nuevaFila)
      .then((docRef) => {
        console.log('Fila agregada con ID:', docRef.id);
      })
      .catch((error) => {
        console.error('Error al agregar fila:', error);
      });
  }

  removeRow(index: number) {
    if (!this.isAdmin) {
      console.warn('No tienes permisos para eliminar filas.');
      return;
    }

    const id = this.data[index].id;
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

  saveRow(index: number) {
    if (!this.isAdmin) {
      console.warn('No tienes permisos para guardar cambios.');
      return;
    }

    const id = this.data[index].id;
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

  goBack() {
    this.router.navigate(['/rancho-detail']);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
