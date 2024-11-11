import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ranchos-modal',
  templateUrl: './ranchos-modal.component.html',
  styleUrls: ['./ranchos-modal.component.scss']
})
export class RanchosModalComponent {
  rancho = {
    nombre: '',
    psg: '',
    descripcion: '',
    imagenUrl: '',
    codeInscription: ''
    
  };
  selectedFile: File | null = null;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private alertController: AlertController  // Importamos el AlertController
  ) {}

  dismissModal() {
    this.modalController.dismiss({
      
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit() {
    if (this.selectedFile) {
      const filePath = `ranchos/${new Date().getTime()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedFile);

      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url: string) => {
            this.rancho.imagenUrl = url;
            this.saveRancho();
          });
        })
      ).subscribe();
    } else {
      this.saveRancho();
    }
  }

  private saveRancho() {
    this.firestore.collection('ranchos').add(this.rancho)
      .then(() => {
        this.dismissModal(); // Cierra la modal primero
        this.showSuccessAlert();  // Luego muestra la alerta
      })
      .catch((error: any) => {
        console.error("Error saving ranch:", error);
      });
  }

  // Función para mostrar la alerta
  async showSuccessAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Rancho registrado correctamente.',
      buttons: [{
        text: 'OK',
       handler: () => {
        console.log('Cerrando modal...');
        this.dismissModal();
      }
      
      }]
    });

    await alert.present();
  }

  
}
