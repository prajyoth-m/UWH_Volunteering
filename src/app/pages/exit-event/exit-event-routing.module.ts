import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExitEventPage } from './exit-event.page';

const routes: Routes = [
  {
    path: '',
    component: ExitEventPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExitEventPageRoutingModule {}
