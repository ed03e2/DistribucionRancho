import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PriceBecerrosPage } from './price-becerros.page';

const routes: Routes = [
  {
    path: '',
    component: PriceBecerrosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceBecerrosPageRoutingModule {}
