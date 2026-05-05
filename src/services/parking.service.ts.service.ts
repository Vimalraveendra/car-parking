import { Injectable, signal ,computed} from '@angular/core';
import { Booking, ParkingSlot, ParkingStats, SlotStatus ,Floor} from '../app/models/parking.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService{

  private parkingSlots=signal<ParkingSlot[]>(this.generateParkingSlots());
  private bookings=signal<Booking[]>([])


  readonly parkingSlots$=this.parkingSlots.asReadonly();
  readonly bookings$=this.bookings.asReadonly();


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

   readonly parkingStats = computed<ParkingStats>(() => {
    const slots = this.parkingSlots();
    const bookings = this.bookings();
    const revenue = bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + (b.totalCost ?? 0), 0);
   const stats:ParkingStats = {
      total: slots.length,
      available: 0,
      occupied: 0,
      reserved: 0,
      maintenance: 0,
      revenue,
     occupancyRate:0
}

for (let s of slots){
  if(stats[s.status]!==undefined){
    stats[s.status]++
  }
}
stats.occupancyRate=Math.round((stats.occupied/ slots.length) * 100)
    return stats;
  });

    readonly floors = computed<Floor[]>(() => {
    const slots = this.parkingSlots();
    const floorNums= [0, 1, 2];
    return floorNums.map(f => ({
      number: f,
      label: f === 0 ? 'Ground Floor' : `Floor ${f}`,
      slots: slots.filter(s => s.floor === f),
    }));
  });

  getActiveBookings():Booking[]{
      return this.bookings().filter(b => b.status === 'active');
  }

}
 