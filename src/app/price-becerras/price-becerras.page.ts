import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../service/auth.service'; // Asegúrate de que este servicio exista

@Component({
  selector: 'app-price-becerras',
  templateUrl: './price-becerras.page.html',
  styleUrls: ['./price-becerras.page.scss'],
})
export class PriceBecerrasPage implements OnInit {
  data: { id?: string; peso: string; precio: string; numero2: string; cn: string }[] = []; // Array de datos
  isAdmin: boolean = false; // Propiedad para controlar permisos

  constructor(
    private router: Router,
    private firestore: AngularFirestore,
    private authService: AuthService // Servicio de autenticación
  ) {}

  ngOnInit() {
    // Recuperar los datos de Firebase al cargar la página
    this.firestore
      .collection('becerras') // Reemplaza 'becerras' por el nombre de tu colección en Firebase
      .valueChanges({ idField: 'id' }) // Incluye el ID del documento
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

  // Método para agregar una nueva fila
  addRow() {
    if (!this.isAdmin) {
      console.warn('No tienes permisos para agregar filas.');
      return;
    }

    const nuevaFila = { peso: '', precio: '', numero2: '', cn: '' };
    this.firestore
      .collection('becerras') // Reemplaza 'becerras' con tu colección
      .add(nuevaFila)
      .then((docRef) => {
        console.log('Fila agregada con ID:', docRef.id);
      })
      .catch((error) => {
        this.handleError('Error al agregar fila', error);
      });
  }

  // Método para eliminar una fila
  removeRow(index: number) {
    if (!this.isAdmin) {
      console.warn('No tienes permisos para eliminar filas.');
      return;
    }

    const id = this.data[index].id; // ID del documento en Firebase
    if (id) {
      this.firestore
        .collection('becerras')
        .doc(id)
        .delete()
        .then(() => {
          console.log('Fila eliminada con ID:', id);
        })
        .catch((error) => {
          this.handleError('Error al eliminar fila', error);
        });
    }
  }

  // Método para guardar cambios en una fila
  saveRow(index: number) {
    if (!this.isAdmin) {
      console.warn('No tienes permisos para guardar cambios.');
      return;
    }

    const id = this.data[index].id; // ID del documento en Firebase
    const updatedData = {
      peso: this.data[index].peso,
      precio: this.data[index].precio,
      numero2: this.data[index].numero2,
      cn: this.data[index].cn,
    };

    if (id) {
      this.firestore
        .collection('becerras')
        .doc(id)
        .update(updatedData)
        .then(() => {
          console.log('Fila actualizada con ID:', id);
        })
        .catch((error) => {
          this.handleError('Error al actualizar fila', error);
        });
    }
  }

  // Método para navegar a la página anterior
  goBack() {
    this.router.navigate(['/rancho-detail']);
  }

  // trackBy para mejorar el rendimiento de las filas
  trackByIndex(index: number, item: any): number {
    return index;
  }

  // Método para manejar errores
  private handleError(message: string, error: any) {
    console.error(message, error);
    alert(`${message}: ${error.message}`);
  }
}
