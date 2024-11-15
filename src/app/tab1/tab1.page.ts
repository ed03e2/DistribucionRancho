import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
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
    private alertController: AlertController, 
    private loadingController: LoadingController 
  ) {}

  ngOnInit() {
    this.loadRanchos(); 
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Cargando...',
      spinner: 'circles'
    });
    await loading.present();
    return loading;
  }

  async loadRanchos() {
    const loading = await this.showLoading(); // Mostrar el loading card

    // Cargar ranchos desde Firestore
    this.firestore.collection('ranchos').valueChanges().subscribe(
      (data: any[]) => {
        this.ranchos = data; // Actualizar ranchos solo después de completar la carga
        loading.dismiss(); // Ocultar el loading card
      },
      error => {
        console.error("Error al cargar los ranchos:", error);
        loading.dismiss(); // Ocultar el loading card en caso de error
      }
    );
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: RanchosModalComponent,
    });

    modal.onDidDismiss().then(() => {
      this.loadRanchos(); 
    });

    return await modal.present();
  }

  async goToRanchoDetail(nombre: string, descripcion: string, psg: string) {
    const inscrito = localStorage.getItem(`rancho_${nombre}`);
  
    if (inscrito) {
      this.router.navigate(['/rancho-detail'], {
        queryParams: { 
          nombre: nombre,
          descripcion: descripcion,
          psg: psg
        }
      });
      return;
    }
  
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
          handler: async (data) => {
            const codigoIngresado = data.codigoVerificacion;
  
            const snapshot = await this.firestore.collection('ranchos', ref =>
              ref.where('nombre', '==', nombre)
            ).get().toPromise();
  
            if (snapshot && !snapshot.empty) {
              const ranchoData = snapshot.docs[0].data() as { codigoVerificacion: string };
  
              if (codigoIngresado === ranchoData.codigoVerificacion) {
                localStorage.setItem(`rancho_${nombre}`, 'inscrito');
  
                this.router.navigate(['/rancho-detail'], {
                  queryParams: { 
                    nombre: nombre,
                    descripcion: descripcion 
                  }
                });
              } else {
                this.showErrorAlert();
              }
            } else {
              this.showErrorAlert();
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async showErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'El código de verificación es incorrecto. Intenta nuevamente.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
