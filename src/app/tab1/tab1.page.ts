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

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private router: Router,
    private alertController: AlertController, 
    private loadingController: LoadingController,
    private authservice:AuthService
  ) {}

  ngOnInit() {
    this.loadRanchos(); 
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
    // Comprobar si ya está inscrito en Firestore
    const uid = this.authservice.getUserUid();
    const snapshot = await this.firestore.collection('inscripciones', ref =>
      ref.where('uid', '==', uid).where('nombreRancho', '==', nombre)
    ).get().toPromise();
  
    if (snapshot && !snapshot.empty) {
      // Usuario ya inscrito, redirigir a detalles
      this.router.navigate(['/rancho-detail'], {
        queryParams: { nombre, descripcion, psg }
      });
      return;
    }
  
    // Obtener el nombre del usuario desde Firebase Authentication
    const user = await this.authservice.getUser(); // Asegúrate de que este método devuelva la información del usuario autenticado
    const userName= user!.displayName || 'Usuario desconocido'; 
    console.log(userName)// Puedes usar el nombre del usuario o un valor predeterminado si no está disponible
  
    // Solicitar el código de verificación si no está inscrito
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
  
            // Validar el código ingresado con Firestore
            const ranchoSnapshot = await this.firestore.collection('ranchos', ref =>
              ref.where('nombre', '==', nombre)
            ).get().toPromise();
  
            if (ranchoSnapshot && !ranchoSnapshot.empty) {
              const ranchoDoc = ranchoSnapshot.docs[0];
              const ranchoData = ranchoDoc.data() as { codigoVerificacion: string };
  
              if (codigoIngresado === ranchoData.codigoVerificacion) {
                // Guardar inscripción en Firestore
                await ranchoDoc.ref.collection('usuarios').doc(uid).set({
                  nombre: userName,  // Guardamos el nombre del usuario
                  uid,
                  fecha: new Date()
                });
  
                await this.firestore.collection('inscripciones').add({
                  uid,
                  nombreRancho: nombre,
                  fecha: new Date()
                });
  
                // Redirigir a los detalles del rancho
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
