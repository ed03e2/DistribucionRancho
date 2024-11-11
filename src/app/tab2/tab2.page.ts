import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  profilePicture: string | undefined;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router // Inyectar Router
  ) {}

  ngOnInit() {
    // Cargar la imagen de perfil desde localStorage si existe
    const savedImage = localStorage.getItem('profilePicture');
    this.profilePicture = savedImage ? savedImage : 'assets/profile-picture.jpg';
  }

  async changeProfilePicture() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actualizar Foto de Perfil',
      buttons: [
        {
          text: 'Tomar Foto',
          icon: 'camera-outline',
          handler: () => {
            this.selectImage(CameraSource.Camera);
          },
        },
        {
          text: 'Seleccionar de la Galería',
          icon: 'image-outline',
          handler: () => {
            this.selectImage(CameraSource.Photos);
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

  async selectImage(source: CameraSource) {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl,
      source: source,
    });

    // Guardar la imagen en localStorage y actualizar la variable de imagen de perfil
    this.profilePicture = image.dataUrl!;
    localStorage.setItem('profilePicture', this.profilePicture);
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

  // Función de logout
  logout() {
    // Eliminar información de sesión del almacenamiento local o cualquier otro almacenamiento
    localStorage.removeItem('profilePicture');
    
    // Redirigir a la pantalla de inicio de sesión (HomeLogin)
    this.router.navigate(['/login']);
  }
}
