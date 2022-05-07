import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisteredPeoplePageRoutingModule } from './registered-people-routing.module';

import { RegisteredPeoplePage } from './registered-people.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisteredPeoplePageRoutingModule
  ],
  declarations: [RegisteredPeoplePage]
})
export class RegisteredPeoplePageModule {}
