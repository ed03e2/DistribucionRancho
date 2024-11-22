import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PriceBecerrasPageRoutingModule } from './price-becerras-routing.module';

import { PriceBecerrasPage } from './price-becerras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PriceBecerrasPageRoutingModule
  ],
  declarations: [PriceBecerrasPage]
})
export class PriceBecerrasPageModule {}
