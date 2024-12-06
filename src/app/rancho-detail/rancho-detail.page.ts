import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../service/auth.service'; // Asegúrate de importar tu servicio de autenticación
import { EditRanchoModalComponent } from '../edit-rancho-modal/edit-rancho-modal.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-rancho-detail',
  templateUrl: './rancho-detail.page.html',
  styleUrls: ['./rancho-detail.page.scss'],
})
export class RanchoDetailPage implements OnInit {
  ranchoNombre: string | undefined;
  ranchoDescripcion: string | undefined;
  ranchoPsg: string | undefined;
  ranchoId: string | undefined;
  codigoVerificacion: string | undefined; // Campo para el código de verificación
  isAdmin: boolean = false; // Variable para verificar si el usuario es administrador

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private authService: AuthService, // Servicio para roles
    private toastController: ToastController // Servicio para mostrar toasts
  ) {}

  ngOnInit() {
    this.loadUserRole(); // Cargar el rol del usuario

    // Obtener parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      this.ranchoNombre = params['nombre'];
      this.ranchoDescripcion = params['descripcion'];
      this.ranchoPsg = params['psg'];
      this.ranchoId = params['id'];
      this.loadRanchoId();
    });
  }

  // Función para mostrar un toast
  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom',
    });
    toast.present();
  }

  // Cargar el rol del usuario
  async loadUserRole() {
    const uid = this.authService.getUserUid();
    try {
      const role = await this.authService.getUserRole(uid);
      this.isAdmin = role === 'admin'; // Verificar si el rol es "admin"
      console.log('¿Es administrador?', this.isAdmin);
    } catch (error) {
      console.error('Error al obtener el rol:', error);
    }
  }

  async loadRanchoId() {
    const snapshot = await this.firestore
      .collection('ranchos', (ref) => ref.where('nombre', '==', this.ranchoNombre))
      .get()
      .toPromise();

    if (snapshot && !snapshot.empty) {
      const ranchoData = snapshot.docs[0].data() as any; // Asegúrate de que el campo exista
      this.ranchoId = snapshot.docs[0].id;
      this.codigoVerificacion = ranchoData.codigoVerificacion; // Cargar el código de verificación desde la base de datos
      console.log('Código de verificación cargado:', this.codigoVerificacion);
    } else {
      console.error('Rancho no encontrado');
    }
  }

  async deleteRancho() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este rancho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (this.ranchoId) {
              await this.firestore.collection('ranchos').doc(this.ranchoId).delete();
              this.presentToast('Rancho eliminado con éxito', 'danger');
              this.router.navigate(['/tabs/tab1']);
            } else {
              console.error('Rancho no encontrado para eliminar');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async openEditModal() {
    const modal = await this.modalController.create({
      component: EditRanchoModalComponent,
      componentProps: {
        rancho: {
          nombre: this.ranchoNombre,
          descripcion: this.ranchoDescripcion,
          psg: this.ranchoPsg,
        },
        ranchoId: this.ranchoId,
      },
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const updatedRancho = data.data;
        this.ranchoNombre = updatedRancho.nombre;
        this.ranchoDescripcion = updatedRancho.descripcion;
        this.ranchoPsg = updatedRancho.psg;

        // Mostrar el toast de éxito
        this.presentToast('Rancho editado con éxito');
      }
    });

    await modal.present();
  }

  async openUserModal(ranchoId: string) {
    const modal = await this.modalController.create({
      component: UserComponent,
      componentProps: { ranchoId },
    });

    await modal.present();
  }

  goBack() {
    this.router.navigate(['tabs/tab1']);
  }

  openGroups() {
    this.router.navigate(['/grupos']);
  }

  openUser() {
    this.router.navigate(['/users']);
  }

  async goToPriceBecerros() {
    this.router.navigate(['/price-becerros']);
  }

  async goToPriceBecerras() {
    this.router.navigate(['/price-becerras']);
  }
}
