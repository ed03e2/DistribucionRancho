import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-products-modal',
  templateUrl: './products-modal.component.html',
  styleUrls: ['./products-modal.component.scss'],
})
export class ProductsModalComponent  implements OnInit {

  constructor( private modalController: ModalController) { }

  ngOnInit() {}
  dismissModal() {
    this.modalController.dismiss({
      
    });
  }
}
