import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingupPageRoutingModule } from './singup-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SingupPage } from './singup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SingupPage]
})
export class SingupPageModule {}
