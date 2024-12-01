import { Component } from '@angular/core';
import { ModalController, AlertController, ToastController } from '@ionic/angular';
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
    codigoVerificacion: ''  // Nuevo campo para el código de verificación
  };
  selectedFile: File | null = null;

  constructor(
    private modalController: ModalController,
    private firestore: AngularFirestore,
    private storage: AngularFireStorage,
    private alertController: AlertController,
    private toastCtrl: ToastController // Inyectamos el ToastController

  ) {}

  dismissModal() {
    this.modalController.dismiss();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
    }
  }

  async onSubmit() {
    if (!this.rancho.codigoVerificacion) {
      // Si el código de verificación no está presente, muestra un mensaje de alerta
      this.showErrorAlert('Por favor, ingrese el código de verificación.');
      return;
    }

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
        this.showSuccessToast();  // Luego muestra el toast
      })
      .catch((error: any) => {
        console.error("Error saving ranch:", error);
      });
  }
  
  // Función para mostrar el toast de éxito
  async showSuccessToast() {
    const toast = await this.toastCtrl.create({
      message: 'Rancho registrado correctamente.',
      duration: 2000, // Duración en milisegundos (2 segundos)
      position: 'bottom', // Posición del toast ('top', 'middle', 'bottom')
      color: 'success' // Color del toast (puedes cambiarlo a 'primary', 'warning', etc.)
    });
  
    await toast.present();
  }
  

  // Función para mostrar alerta de error
  async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
