import { Component, inject, signal } from '@angular/core';
import { CustomSelectComponent } from '../shared/components/custom-select/custom-select.component';
import { PARKING_SLOTS, PARKING_TYPES } from '../shared/data/parking-categories';
import { ParkingService } from '../services/parking.service.ts.service';

@Component({
  selector: 'app-parking-grid',
  standalone:true,
  imports: [CustomSelectComponent],
  templateUrl: './parking-grid.component.html',
  styleUrl: './parking-grid.component.scss'
})
export class ParkingGridComponent {

 private parkingService=inject(ParkingService)

 parkingFloors=this.parkingService.floors;
 activeParkingFloor=signal(0)
  optionsData=PARKING_SLOTS;
  optionsType=PARKING_TYPES;

   setParkingFloor(floor: number) { this.activeParkingFloor.set(floor); }

    parkingFloorAvailable(floor: number): number {
    return this.parkingFloors().find(f => f.number === floor)?.slots
      .filter(s => s.status === 'available').length ?? 0;
  }

}
