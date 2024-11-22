import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsModalComponent } from '../products-modal/products-modal.component';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { EditRanchoModalComponent } from '../edit-rancho-modal/edit-rancho-modal.component';

@Component({
  selector: 'app-rancho-detail',
  templateUrl: './rancho-detail.page.html',
  styleUrls: ['./rancho-detail.page.scss'],
})
export class RanchoDetailPage implements OnInit {
  ranchoNombre: string | undefined;
  ranchoDescripcion: string | undefined;
  ranchoPsg: string | undefined; // Nuevo campo
  ranchoId: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
    private firestore: AngularFirestore
  ) {}

  ngOnInit() {
    // Retrieve query parameters and set them to variables
    this.route.queryParams.subscribe(params => {
      this.ranchoNombre = params['nombre'];
      this.ranchoDescripcion = params['descripcion'];
      this.ranchoPsg = params['psg']; // Asignar el PSG
      this.ranchoId = params['id']
      this.loadRanchoId();
    });
  }

  // Method to load the rancho ID based on its name
  async loadRanchoId() {
    const snapshot = await this.firestore.collection('ranchos', ref =>
      ref.where('nombre', '==', this.ranchoNombre)
    ).get().toPromise();

    if (snapshot && !snapshot.empty) {
      this.ranchoId = snapshot.docs[0].id;
    } else {
      console.error("Rancho not found");
    }
  }

  // Method to delete the rancho with a confirmation alert
  async deleteRancho() {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this rancho?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: async () => {
            if (this.ranchoId) {
              await this.firestore.collection('ranchos').doc(this.ranchoId).delete();
              this.router.navigate(['/tabs/tab1']); // Navigate back to the ranchos list
            } else {
              console.error("Rancho not found for deletion");
            }
          }
        }
      ]
    });

    await alert.present();
  }

  openChat() {
    this.router.navigate(['/chat']);
  }

  openUser() {
    this.router.navigate(['/users']);
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
  
    await modal.present(); // Asegúrate de llamar a present() para mostrar el modal
  }
  
  goBack() {
    this.router.navigate(['tabs/tab1']);
  }

  async goToPriceBecerros(){
    this.router.navigate(['/price-becerros']),{}
  }

  async goToPriceBecerras(){
    this.router.navigate(['/price-becerras']),{}
  }
}
