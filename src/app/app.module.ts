import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms'
import { RanchosModalComponent } from './ranchos-modal/ranchos-modal.component';
// Firebase Imports
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { ProductsModalComponent } from './products-modal/products-modal.component';
import { EditRanchoModalComponent } from './edit-rancho-modal/edit-rancho-modal.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateEmailComponent } from './update-email/update-email.component';
import { UserComponent } from './user/user.component';
@NgModule({
  declarations: [AppComponent,UserComponent, RanchosModalComponent, ProductsModalComponent, EditRanchoModalComponent, UpdateEmailComponent, UpdatePasswordComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    ReactiveFormsModule, 
    FormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
     // Inicializa Firebase
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
