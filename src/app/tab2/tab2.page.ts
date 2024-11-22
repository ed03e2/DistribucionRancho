import { Component } from '@angular/core';
import { ActionSheetController, AlertController, ToastController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Router } from '@angular/router'; // Importar Router
import {firebase} from 'src/app/firebase-config'
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AuthService } from '../service/auth.service';
import { UserProfile } from '../interfaces/user-profile';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  profilePicture: string | undefined;
  profile: UserProfile | undefined;
  profileName: any;
  profileEmail: any;
  profilePhone: any;
  profileSecondName: any;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router, // Inyectar Router
    private database : AngularFirestore,
    private authservice: AuthService
  ) {
    firebase.auth().onAuthStateChanged( user=> {
      if (user){
        console.log("Usuario autenticado", user);
        const result = this.database.doc<UserProfile>(`/profile/${this.authservice.getUserUid()}`);
        var userprofile= result.valueChanges();
        userprofile.subscribe( profile =>{
          if (profile){
            console.log("PROFILE", profile);
            this.profileName = profile['name'] || 'nombre no disponible';
            this.profileSecondName = profile['secondName'] || 'apellido no disponible';
            this.profilePhone = profile['phone'] || 'telefono no disponible';
            this.profileEmail = profile['email']  || 'email no disponible';
            
          }else{
            console.log("PROFILE", profile);
            this.profileName = "no disponible ";
            this.profileSecondName = 'no disponible'
            this.profilePhone = "no disponible";
            this.profileEmail = "no disponible";
          }
        })
        }else{
          console.log('No hay usuario autenticado.');
        }
    })
  }
  

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
