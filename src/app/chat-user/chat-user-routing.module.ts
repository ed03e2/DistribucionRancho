import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatUserPage } from './chat-user.page';

const routes: Routes = [
  {
    path: '',
    component: ChatUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatUserPageRoutingModule {}
