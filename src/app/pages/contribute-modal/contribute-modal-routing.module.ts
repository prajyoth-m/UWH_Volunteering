import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContributeModalPage } from './contribute-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ContributeModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContributeModalPageRoutingModule {}
