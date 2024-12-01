import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-update-email',
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.scss'],
})
export class UpdateEmailComponent implements OnInit {
  newEmail: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private auth: AuthService) {}

  async updateEmail(): Promise<void> {
    this.errorMessage = null;
    this.successMessage = null;

    try {
      // Envía correo de verificación al nuevo email
      await this.auth.verifyAndUpdateEmail(this.newEmail);
      this.successMessage =
        'Un correo de verificación ha sido enviado al nuevo email. Por favor, verifica antes de continuar.';
    } catch (error) {
      this.errorMessage = (error as Error).message; // Convertimos a Error para extraer el mensaje
    }
  }

  ngOnInit() {}
}