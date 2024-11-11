import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ProductsModalComponent } from '../products-modal/products-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-rancho-detail',
  templateUrl: './rancho-detail.page.html',
  styleUrls: ['./rancho-detail.page.scss'],
})
export class RanchoDetailPage implements OnInit {
  ranchoNombre: string | undefined;
  ranchoDescripcion: string | undefined;
  

  constructor(private route: ActivatedRoute, private router: Router, private modalController: ModalController) { }

  ngOnInit() {
    // Retrieve query parameters and set them to variables
    this.route.queryParams.subscribe(params => {
      this.ranchoNombre = params['nombre'];
      this.ranchoDescripcion = params['descripcion'];
    });
  }
  openChat(){
    this.router.navigate(['/chat'])
  }

  openUser(){
    this.router.navigate(['/users'])
  }
  async openModal() {
    const modal = await this.modalController.create({
      component: ProductsModalComponent,
    });

    return await modal.present();
  }
  goBack(){
    this.router.navigate(['tabs/tab1'])
   }

}
