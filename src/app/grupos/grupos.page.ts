import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.page.html',
  styleUrls: ['./grupos.page.scss'],
})
export class GruposPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToRanchos() {
    // Navega a chat-user
    this.router.navigate(['/chat-user']);
  }

  goToAdmin() {
    // Navega a chat-admin
    this.router.navigate(['/chat-admin']);
  }

  goBack() {
    this.router.navigate(['/rancho-detail']);
  }

}
