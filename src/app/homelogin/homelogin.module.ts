import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeloginPageRoutingModule } from './homelogin-routing.module';

import { HomeloginPage } from './homelogin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeloginPageRoutingModule
  ],
  declarations: [HomeloginPage]
})
export class HomeloginPageModule {}
