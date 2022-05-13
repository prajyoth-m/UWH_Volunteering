import { Pipe, PipeTransform } from '@angular/core';
import { Event } from '../models/event';

@Pipe({
  name: 'filterEvents'
})
export class FilterEventsPipe implements PipeTransform {

  transform(value: Array<Event>, filterField: string, filterValue: string): Array<Event> {
    if(!filterField||!filterValue){
      return value;
    }
    if(!value){
      return [];
    }
    return value.filter(event=>(event[filterField]).includes(filterValue)
    );
  }
}
