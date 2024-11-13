import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.page.html',
  styleUrls: ['./login-phone.page.scss'],
})
export class LoginPhonePage implements OnInit {
  phoneNumber: string = '';
  verificationCode: string = '';
  confirmationResult: any;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible'
    });
  }

  async sendVerificationCode() {
    try {
      // Omitimos la verificación con UID y enviamos el código directamente
      this.confirmationResult = await this.authService.loginPhoneauth(this.phoneNumber, this.authService.recaptchaVerifier);
      console.log('Código de verificación enviado');
    } catch (error) {
      console.error('Error al enviar el código de verificación:', error);
    }
  }

  async verifyCode() {
    try {
      const result = await this.confirmationResult.confirm(this.verificationCode);
      console.log('Usuario autenticado con éxito', result.user);
    } catch (error) {
      console.error('Error al verificar el código:', error);
    }
  }
}
