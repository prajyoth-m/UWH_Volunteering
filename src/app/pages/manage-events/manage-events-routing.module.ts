import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageEventsPage } from './manage-events.page';

const routes: Routes = [
  {
    path: '',
    component: ManageEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageEventsPageRoutingModule {}
