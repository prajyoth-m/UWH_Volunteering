import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExplorePageRoutingModule } from './explore-routing.module';

import { ExplorePage } from './explore.page';
import { SharedEventsFilterModule } from 'src/app/shared-events-filter/shared-events-filter.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExplorePageRoutingModule,
    SharedEventsFilterModule,
  ],
  declarations: [ExplorePage],
})
export class ExplorePageModule {}
