import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompleteEventPageRoutingModule } from './complete-event-routing.module';

import { CompleteEventPage } from './complete-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompleteEventPageRoutingModule
  ],
  declarations: [CompleteEventPage]
})
export class CompleteEventPageModule {}
