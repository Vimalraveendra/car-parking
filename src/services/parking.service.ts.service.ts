import { Injectable, signal } from '@angular/core';
import { ParkingSlot, SlotStatus } from '../app/models/parking.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService{

  private parkingSlots=signal<ParkingSlot[]>(this.generateParkingSlots());


  readonly parkingSlots$=this.parkingSlots.asReadonly();


  private generateParkingSlots(): ParkingSlot[] {
    const slots: ParkingSlot[] = [];
    const sections = ['A', 'B', 'C', 'D'];
    const slotsPerSection = 10;
    const floors = [0, 1, 2];

    floors.forEach(floor => {
      sections.forEach(section => {
        for (let i = 1; i <= slotsPerSection; i++) {
          const id = `${floor}-${section}-${i}`;
          const num = `${floor}${section}${i.toString().padStart(2, '0')}`;

          let type: ParkingSlot['type'] = 'standard';
          let status: SlotStatus = 'available';
          let pricePerHour = 3;

          if (section === 'D' && i <= 3) { type = 'disabled'; pricePerHour = 1.5; }
          else if (section === 'C' && i >= 8) { type = 'ev'; pricePerHour = 5; }
          else if (section === 'B' && i >= 6) { type = 'compact'; pricePerHour = 2; }

          // Pre-populate some slots
          const rand = Math.random();
          if (rand < 0.3) status = 'occupied';
          else if (rand < 0.35) status = 'reserved';
          else if (rand < 0.37) status = 'maintenance';

          slots.push({ id, number: num, floor, section, type, status, pricePerHour });
        }
      });
    });

    return slots;
  }

}
