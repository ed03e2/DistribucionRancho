import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RanchosModalComponent } from '../ranchos-modal/ranchos-modal.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  ranchos: any[] = [];

  constructor(private modalController: ModalController, private firestore: AngularFirestore, private router: Router) {}

  ngOnInit() {
    this.loadRanchos(); // Cargar ranchos al iniciar la página
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: RanchosModalComponent,
    });

    modal.onDidDismiss().then(() => {
      this.loadRanchos(); // Recargar ranchos después de cerrar el modal
    });

    return await modal.present();
  }

  goToRanchoDetail(nombre: string, descripcion: string) {
    this.router.navigate(['/rancho-detail'], {
      queryParams: { 
        nombre: nombre,
        descripcion: descripcion 
      }
    });
}
  async loadRanchos() {
    this.firestore.collection('ranchos').valueChanges().subscribe((data: any[]) => {
      this.ranchos = data;
    });
  }

  
}
