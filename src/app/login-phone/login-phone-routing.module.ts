import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginPhonePage } from './login-phone.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPhonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPhonePageRoutingModule {}
