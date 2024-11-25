import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController } from '@ionic/angular';
import { AuthService } from '../service/auth.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';  // Importamos ToastController
import { TermsModalPage } from '../terms-modal/terms-modal.page';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.page.html',
  styleUrls: ['./singup.page.scss'],
})
export class SingupPage implements OnInit {
  termsAccepted: boolean = false; // Estado para saber si los términos han sido aceptados

  validationMessage = {
    name: [{ type: "required", message: "Por favor introduce tu nombre" }],
    secondName: [{ type: "required", message: "Por favor introduce tus apellidos" }],
    phone: [{ type: "required", message: "Por favor introduce tu telefono" }],
    email: [
      { type: "required", message: "Por favor introduce tu correo electronico" },
      { type: "pattern", message: "Tu correo está incompleto. Intenta nuevamente..." }
    ],
    password: [
      { type: "required", message: "Por favor crea tu contraseña" },
      { type: "minlength", message: "Tu contraseña debe tener mínimo 6 caracteres. Intenta nuevamente..." }
    ]
  };

  ValidationFormUser!: FormGroup;
  loading: any;

  constructor(
    private nav: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController // Inyectamos el ToastController
  ) { }

  ngOnInit() {
    // Agregar la validación para 'termsAccepted' como obligatorio y verdadero
    this.ValidationFormUser = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      secondName: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      termsAccepted: [false, Validators.requiredTrue] // Aquí validamos que sea verdadero
    });
  }

  navigate() {
    this.router.navigate(['/login']);
  }

  async registerUser(value: any) {
    // Comprobamos si el formulario es válido y si los términos fueron aceptados
    if (this.ValidationFormUser.valid) {
      this.showalert();
      try {
        const response = await this.authService.userRegistration(value);
        if (response.user) {
          await response.user.updateProfile({
            displayName: value.name
          });
          this.loading.dismiss();

          // Mostrar el toast de "Registro exitoso"
          const toast = await this.toastCtrl.create({
            message: 'Registro exitoso',
            duration: 2000, // Duración del toast
            position: 'bottom', // Posición en la pantalla
            color: 'success' // Color verde para éxito
          });
          toast.present(); // Mostrar el toast

          // Navegar a la página de login después de mostrar el toast
          this.router.navigate(['login']);
        }
      } catch (error: any) {
        this.loading.dismiss();
        this.errorLoading("Error al registrarse: " + error.message);
        console.error(error);
      }
    } else {
      this.errorLoading("Por favor, complete todos los campos correctamente.");
    }
  }

  async errorLoading(message: any) {
    const loading = await this.alertCtrl.create({
      header: "Error",
      message: message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.nav.navigateBack(['singup']);
        }
      }]
    });
    await loading.present();
  }

  async showalert() {
    this.loading = await this.alertCtrl.create({
      message: "Cargando... por favor espere"
    });
    await this.loading.present();
  }

  async showTermsModal() {
    const modal = await this.modalCtrl.create({
      component: TermsModalPage
    });
    
    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.termsAccepted = data.data.accepted; // Obtener el estado de aceptación
        // Actualizamos el estado del formulario de acuerdo a la respuesta
        this.ValidationFormUser.get('termsAccepted')?.setValue(this.termsAccepted);
      } else {
        this.termsAccepted = false; // Resetear si se rechazó
        this.ValidationFormUser.get('termsAccepted')?.setValue(this.termsAccepted);
      }
    });
    
    return await modal.present();
  }
}
