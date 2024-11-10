import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async changeProfilePicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actualizar Foto de Perfil',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera-outline',
          handler: () => {
            console.log('Tomar Foto');
          },
        },
        {
          text: 'Seleccionar de la Galería',
          icon: 'image-outline',
          handler: () => {
            console.log('Seleccionar de la Galería');
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async changePassword() {
    const alert = await this.alertController.create({
      header: 'Cambiar Contraseña',
      inputs: [
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Nueva contraseña',
        },
        {
          name: 'confirmPassword',
          type: 'password',
          placeholder: 'Confirmar contraseña',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (data.newPassword === data.confirmPassword) {
              console.log('Contraseña cambiada:', data.newPassword);
            } else {
              await this.presentErrorToast();
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async presentErrorToast() {
    const toast = await this.toastController.create({
      message: 'Las contraseñas no coinciden',
      duration: 2000,
      color: 'danger'
    });
    toast.present();
  }
}
