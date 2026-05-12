import { Component, inject, signal } from '@angular/core';
import { CustomSelectComponent } from '../shared/components/custom-select/custom-select.component';
import { PARKING_SLOTS, PARKING_TYPES } from '../shared/data/parking-categories';
import { ParkingService } from '../services/parking.service';
import { ParkingSlot } from '../app/models/parking.model';

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
  selectedSlot = signal<ParkingSlot | null>(null);
  actionSlot = signal<ParkingSlot | null>(null);

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
    slotClass(slot: ParkingSlot): string {
    let cls = `slot slot--${slot.status}`;
    if (slot.type === 'ev' && slot.status === 'available') cls += ' slot--ev';
    return cls;
  }

  slotTooltip(slot: ParkingSlot): string {
    if (slot.status === 'occupied' && slot.booking) {
      return `${slot.booking.vehiclePlate} — ${slot.booking.ownerName}`;
    }
    return `${slot.number} · ${slot.type} · $${slot.pricePerHour}/hr`;
  }

   onSlotClick(slot: ParkingSlot): void {
    if (slot.status === 'available') {
      this.selectedSlot.set(slot);
      this.actionSlot.set(null);
    } else if (slot.status === 'occupied' || slot.status === 'maintenance') {
      this.actionSlot.set(slot);
    }
  }
}
