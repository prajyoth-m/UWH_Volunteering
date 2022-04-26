import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExitEventPageRoutingModule } from './exit-event-routing.module';

import { ExitEventPage } from './exit-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExitEventPageRoutingModule
  ],
  declarations: [ExitEventPage]
})
export class ExitEventPageModule {}
