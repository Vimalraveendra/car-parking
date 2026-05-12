import { Component, inject, signal } from '@angular/core';
import { CustomSelectComponent } from '../shared/components/custom-select/custom-select.component';
import { PARKING_SLOTS, PARKING_TYPES } from '../shared/data/parking-categories';
import { ParkingService } from '../services/parking.service';

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
  sections=this.parkingService.sections$;
  filterStatus = signal('all');
  filterType = signal('all');

  setParkingFloor(floorNumber: number) { this.activeParkingFloor.set(floorNumber); }

  getAvailableParkingSlots(floorNumber: number)  {
    return this.parkingService.availableParkingSlots(floorNumber)
  }
  getAvailableSectionSlots(floorNumber:number,section:string){
    return this.parkingService.availableSectionSlots(floorNumber,section)
  }

  getFilteredSlots(floorNumber:number,section:string){
    return this.parkingService.filteredSlots(floorNumber,section,this.filterStatus(),this.filterType())
  }
 getVehicleIcon(type: string){
     return this.parkingService.getIcon(type)
   }
}
