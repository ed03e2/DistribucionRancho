import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { RanchosModalComponent } from '../ranchos-modal/ranchos-modal.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  ranchos: any[] = [];
  isAdmin: boolean = false;
  userName: string = ''; // Variable para almacenar el nombre del usuario

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController, 
    private loadingController: LoadingController,
    private authservice: AuthService
  ) {}

  ngOnInit() {
    this.loadRanchos(); 
    this.loadUserDetails(); // Llamar al método para cargar el nombre del usuario
    const uid = this.authservice.getUserUid();
    this.authservice.getUserRole(uid).then(
      role => {
        this.isAdmin = role === 'admin';
        console.log('¿Es administrador?', this.isAdmin);
      },
      error => {
        console.error('Error al obtener el rol:', error);
      }
    );
  }

  async loadUserDetails() {
    try {
      const user = await this.authservice.getCurrentUser();
      if (user) {
        this.userName = user.displayName || 'Usuario desconocido'; // Asignar el nombre del usuario o un valor predeterminado
        console.log('Nombre de usuario cargado:', this.userName);
      } else {
        console.warn('Usuario no autenticado');
      }
    } catch (error) {
      console.error('Error al cargar los detalles del usuario:', error);
    }
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
    const loading = await this.showLoading();

    this.firestore.collection('ranchos').valueChanges().subscribe(
      (data: any[]) => {
        this.ranchos = data;
        loading.dismiss();
      },
      error => {
        console.error("Error al cargar los ranchos:", error);
        loading.dismiss();
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
    const uid = this.authservice.getUserUid();
    const snapshot = await this.firestore.collection('inscripciones', ref =>
      ref.where('uid', '==', uid).where('nombreRancho', '==', nombre)
    ).get().toPromise();

    if (snapshot && !snapshot.empty) {
      this.router.navigate(['/rancho-detail'], {
        queryParams: { nombre, descripcion, psg }
      });
      return;
    }

    const alert = await this.alertController.create({
      header: 'Código de Verificación',
      message: 'Por favor ingrese el código de verificación para acceder a esta clase.',
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
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: async (data) => {
            const codigoIngresado = data.codigoVerificacion;

            const ranchoSnapshot = await this.firestore.collection('ranchos', ref =>
              ref.where('nombre', '==', nombre)
            ).get().toPromise();

            if (ranchoSnapshot && !ranchoSnapshot.empty) {
              const ranchoDoc = ranchoSnapshot.docs[0];
              const ranchoData = ranchoDoc.data() as { codigoVerificacion: string };

              if (codigoIngresado === ranchoData.codigoVerificacion) {
                await ranchoDoc.ref.collection('usuarios').doc(uid).set({
                  nombre: this.userName,  // Usar el nombre del usuario cargado
                  uid,
                  fecha: new Date()
                });

                await this.firestore.collection('inscripciones').add({
                  uid,
                  nombreRancho: nombre,
                  fecha: new Date()
                });

                this.router.navigate(['/rancho-detail'], {
                  queryParams: { nombre, descripcion, psg }
                });
              } else {
                this.showErrorAlert('Código incorrecto');
              }
            } else {
              this.showErrorAlert('Rancho no encontrado');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
