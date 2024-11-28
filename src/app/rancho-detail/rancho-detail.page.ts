import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../service/auth.service'; // Asegúrate de importar tu servicio de autenticación
import { EditRanchoModalComponent } from '../edit-rancho-modal/edit-rancho-modal.component';

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
  isAdmin: boolean = false; // Variable para verificar si el usuario es administrador

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private firestore: AngularFirestore,
    private authService: AuthService // Servicio para roles
  ) {}

  ngOnInit() {
    this.loadUserRole(); // Cargar el rol del usuario

    // Obtener parámetros de la ruta
    this.route.queryParams.subscribe(params => {
      this.ranchoNombre = params['nombre'];
      this.ranchoDescripcion = params['descripcion'];
      this.ranchoPsg = params['psg'];
      this.ranchoId = params['id'];
      this.loadRanchoId();
    });
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
    const snapshot = await this.firestore.collection('ranchos', ref =>
      ref.where('nombre', '==', this.ranchoNombre)
    ).get().toPromise();

    if (snapshot && !snapshot.empty) {
      this.ranchoId = snapshot.docs[0].id;
    } else {
      console.error("Rancho no encontrado");
    }
  }

  async deleteRancho() {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: '¿Estás seguro de que quieres eliminar este rancho?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            if (this.ranchoId) {
              await this.firestore.collection('ranchos').doc(this.ranchoId).delete();
              this.router.navigate(['/tabs/tab1']);
            } else {
              console.error("Rancho no encontrado para eliminar");
            }
          }
        }
      ]
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
          psg: this.ranchoPsg
        },
        ranchoId: this.ranchoId
      }
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        const updatedRancho = data.data;
        this.ranchoNombre = updatedRancho.nombre;
        this.ranchoDescripcion = updatedRancho.descripcion;
        this.ranchoPsg = updatedRancho.psg;
      }
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
  
  async goToPriceBecerros(){
    this.router.navigate(['/price-becerros']),{}
  }
  
  async goToPriceBecerras(){
    this.router.navigate(['/price-becerras']),{}
  }
}
