import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterEventsPipe } from '../pipes/filter-events.pipe';

@NgModule({
  declarations: [FilterEventsPipe],
  imports: [CommonModule],
  exports: [FilterEventsPipe],
})
export class SharedEventsFilterModule {}
