import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PriceBecerrasPage } from './price-becerras.page';

const routes: Routes = [
  {
    path: '',
    component: PriceBecerrasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PriceBecerrasPageRoutingModule {}
