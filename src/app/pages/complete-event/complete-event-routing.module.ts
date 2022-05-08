import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompleteEventPage } from './complete-event.page';

const routes: Routes = [
  {
    path: '',
    component: CompleteEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompleteEventPageRoutingModule {}
