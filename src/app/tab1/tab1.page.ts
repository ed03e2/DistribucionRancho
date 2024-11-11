import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { RanchosModalComponent } from '../ranchos-modal/ranchos-modal.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  ranchos: any[] = [];

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController // Importamos el AlertController
  ) {}

  ngOnInit() {
    this.loadRanchos(); // Cargar ranchos al iniciar la página
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: RanchosModalComponent,
    });

    modal.onDidDismiss().then(() => {
      this.loadRanchos(); // Recargar ranchos después de cerrar el modal
    });

    return await modal.present();
  }

  // Modificamos la función para pedir el código de verificación
  async goToRanchoDetail(nombre: string, descripcion: string) {
    const alert = await this.alertController.create({
      header: 'Código de Verificación',
      message: 'Por favor ingrese el código de verificación para acceder a los detalles del rancho.',
      inputs: [
        {
          name: 'codigoVerificacion',
          type: 'text',
          placeholder: 'Código de Verificación'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Acceso denegado');
          }
        },
        {
          text: 'Aceptar',
          handler: (data) => {
            const codigoIngresado = data.codigoVerificacion;
            console.log('Código ingresado: ', codigoIngresado); // Depuración
  
            // Asegúrate de que el código guardado sea exactamente '1234'
            if (codigoIngresado === '1234') {
              console.log('Código correcto');
              this.router.navigate(['/rancho-detail'], {
                queryParams: { 
                  nombre: nombre,
                  descripcion: descripcion 
                }
              });
            } else {
              console.log('Código incorrecto');
              this.showErrorAlert();
            }
          }
        }
      ]
    });
  
    await alert.present();
  }
  

  async loadRanchos() {
    this.firestore.collection('ranchos').valueChanges().subscribe((data: any[]) => {
      this.ranchos = data;
    });
  }

  // Función para mostrar alerta de error cuando el código de verificación es incorrecto
  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El código de verificación es incorrecto. Intenta nuevamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
