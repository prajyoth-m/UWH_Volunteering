import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageEventsPageRoutingModule } from './manage-events-routing.module';

import { ManageEventsPage } from './manage-events.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageEventsPageRoutingModule
  ],
  declarations: [ManageEventsPage]
})
export class ManageEventsPageModule {}
