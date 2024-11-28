import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {
email: string='';
  constructor(
    private Authservice: AuthService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }
  async ResetPasswordUser(){
    try{
      await this.Authservice.resetPassword(this.email);
      this.showToast('Correo de recuperación enviado.');
    } catch (error) {
      this.showToast('Error al enviar el correo de recuperación.');
      console.error(error);
    }
  }
  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
