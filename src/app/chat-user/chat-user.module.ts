import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatUserPageRoutingModule } from './chat-user-routing.module';

import { ChatUserPage } from './chat-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatUserPageRoutingModule
  ],
  declarations: [ChatUserPage]
})
export class ChatUserPageModule {}
