import { Pipe, PipeTransform } from '@angular/core';
import { ParkingSlot } from '../models/parking.model';

@Pipe({
  name: 'floorOccupied'
})
export class FloorOccupiedPipe implements PipeTransform {

  transform(slots: ParkingSlot[]):number {
        return slots.filter(s => s.status === 'occupied').length;
  }

}
