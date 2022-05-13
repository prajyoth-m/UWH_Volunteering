import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageEventsPageRoutingModule } from './manage-events-routing.module';

import { ManageEventsPage } from './manage-events.page';
import { SharedEventsFilterModule } from 'src/app/shared-events-filter/shared-events-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ManageEventsPageRoutingModule,
    SharedEventsFilterModule,
  ],
  declarations: [ManageEventsPage],
})
export class ManageEventsPageModule {}
