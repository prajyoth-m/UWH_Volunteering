import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisteredPeoplePage } from './registered-people.page';

const routes: Routes = [
  {
    path: '',
    component: RegisteredPeoplePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisteredPeoplePageRoutingModule {}
