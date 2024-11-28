import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service'; // Importa tu servicio de autenticación

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {
  isAdmin: boolean = false; // Variable para controlar si es admin

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    const uid = this.authService.getUserUid(); // Obtén el UID del usuario autenticado
    if (uid) {
      this.authService.getUserRole(uid).then(
        (role) => {
          this.isAdmin = role === 'admin'; // Verifica si el rol es admin
          console.log('¿Es administrador?', this.isAdmin);
        },
        (error) => {
          console.error('Error al obtener el rol del usuario:', error);
        }
      );
    } else {
      console.error('No se encontró UID del usuario.');
    }
  }

  goToRanchos() {
    this.router.navigate(['/chat-user']);
  }

  goToAdmin() {
    // Verifica si el usuario es admin antes de navegar
    if (this.isAdmin) {
      this.router.navigate(['/chat-admin']);
    } else {
      console.error('No tienes permisos para acceder a esta página');
    }
  }

  goBack() {
    this.router.navigate(['/rancho-detail']);
  }
}
