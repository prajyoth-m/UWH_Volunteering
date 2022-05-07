import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventEditorPageRoutingModule } from './event-editor-routing.module';

import { EventEditorPage } from './event-editor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventEditorPageRoutingModule
  ],
  declarations: [EventEditorPage]
})
export class EventEditorPageModule {}
