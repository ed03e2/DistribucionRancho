import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeloginPage } from './homelogin.page';

const routes: Routes = [
  {
    path: '',
    component: HomeloginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeloginPageRoutingModule {}
