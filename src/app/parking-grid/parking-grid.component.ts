import { Component, inject, signal } from '@angular/core';
import { CustomSelectComponent } from '../shared/components/custom-select/custom-select.component';
import { PARKING_SLOTS, PARKING_TYPES } from '../shared/data/parking-categories';
import { ParkingService } from '../services/parking.service';
import { ParkingSlot, SelectOption } from '../models/parking.model';
import { BookingModalComponent } from '../booking-modal/booking-modal.component';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-parking-grid',
  standalone:true,
  imports: [CustomSelectComponent,BookingModalComponent,DatePipe,FormsModule],
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
  selectedSlot = signal<ParkingSlot | null>(null);
  actionSlot = signal<ParkingSlot | null>(null);
  selectSlotOption=signal({label:'All Sorts',value:'all'})
  selectSlotType=signal({label:'All Types',value:'all'})
  searchPlate="";
    foundSlot = signal<ParkingSlot | null>(null);

  setParkingFloor(floorNumber: number) { this.activeParkingFloor.set(floorNumber); }

  getAvailableParkingSlots(floorNumber: number)  {
    return this.parkingService.availableParkingSlots(floorNumber)
  }
  getAvailableSectionSlots(floorNumber:number,section:string){
    return this.parkingService.availableSectionSlots(floorNumber,section)
  }

  getFilteredSlots(floorNumber:number,section:string){
    return this.parkingService.filteredSlots(floorNumber,section,this.selectSlotOption().value,this.selectSlotType().value)
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
  setSelectedSlot(option:SelectOption){
    const {label,value}=option
     this.selectSlotOption.set({label,value})
  }
   setSelectedType(option:SelectOption){
     const {label,value}=option
     this.selectSlotType.set({label,value})
  }

  onBooked(): void {
    this.selectedSlot.set(null);
  }

   checkOut(bookingId: string): void {
    this.parkingService.checkOut(bookingId);
    this.actionSlot.set(null);
    this.foundSlot.set(null);
  }

  toggleMaintenance(slotId: string): void {
    this.parkingService.toggleMaintenance(slotId);
    this.actionSlot.set(null);
  }

  onSearch(): void {
    if (!this.searchPlate.trim()) { this.foundSlot.set(null); return; }
    const slot = this.parkingService.searchSlot(this.searchPlate.trim());
    this.foundSlot.set(slot ?? null);
    if (slot) this.activeParkingFloor.set(slot.floor);
  }
}
