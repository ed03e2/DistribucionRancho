import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PriceBecerrosPageRoutingModule } from './price-becerros-routing.module';

import { PriceBecerrosPage } from './price-becerros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PriceBecerrosPageRoutingModule
  ],
  declarations: [PriceBecerrosPage]
})
export class PriceBecerrosPageModule {}
