import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContributeModalPageRoutingModule } from './contribute-modal-routing.module';

import { ContributeModalPage } from './contribute-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContributeModalPageRoutingModule
  ],
  declarations: [ContributeModalPage]
})
export class ContributeModalPageModule {}
