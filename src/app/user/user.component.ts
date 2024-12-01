import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { NavParams } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent  implements OnInit {
  usuarios: any[] = [];
  ranchoId: any;
  user:any;

  constructor(
  private modalCtrl: ModalController,
  private firestore: AngularFirestore,
  private navParams: NavParams // Importa NavParams
  ) { 
    this.ranchoId = this.navParams.get('ranchoId'); // Obtiene el ranchoId
  }

  ngOnInit() {
    if (!this.ranchoId) {
      console.error('RanchoId no proporcionado.');
      return;
    }
    console.log('RanchoId recibido:', this.ranchoId);
  
    this.firestore
      .collection(`ranchos/${this.ranchoId}/usuarios`)
      .valueChanges()
      .subscribe(users => {
        console.log('Usuarios obtenidos:', users); // Verifica los usuarios en consola
        this.usuarios = users;
      });
  }
  dismissModal() {
    this.modalCtrl.dismiss();
  }

}
