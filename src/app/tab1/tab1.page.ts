import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {add} from 'ionicons/icons'
import { RanchosModalComponent } from '../ranchos-modal/ranchos-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(private modalController: ModalController) {}

  async openModal() {
    const modal = await this.modalController.create({
      component: RanchosModalComponent,
    });
    return await modal.present();
  }
}
