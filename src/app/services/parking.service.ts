import { Injectable, signal ,computed} from '@angular/core';
import { Booking, ParkingSlot, ParkingStats, SlotStatus, Floor } from '../models/parking.model';

@Injectable({
  providedIn: 'root'
})
export class ParkingService{
  private sections= signal<string[]> (['A', 'B', 'C', 'D']);
  private parkingSlots=signal<ParkingSlot[]>(this.generateParkingSlots());
  private bookings=signal<Booking[]>([])



  readonly parkingSlots$=this.parkingSlots.asReadonly();
  readonly bookings$=this.bookings.asReadonly();
  readonly sections$= this.sections.asReadonly();


  private generateParkingSlots(): ParkingSlot[] {
    const slots: ParkingSlot[] = [];
    const sections = this.sections();
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

  readonly activeBookings =computed(()=>this.bookings().filter(b => b.status === 'active'));
  readonly completedBookings =computed(()=>this.bookings().filter(b => b.status === 'completed'));
 readonly totalRevenue = computed(() => this.completedBookings().reduce((sum, b) => sum + (b.totalCost ?? 0), 0));
   
   getIcon(type: string): string {
    const icons: Record<string, string> = {
      standard: '🚗', compact: '🚙', disabled: '♿', ev: '⚡'
    };
    return icons[type] ?? '🚗';
  }

  availableParkingSlots(floorNumber:number):number{
    return this.floors().find(f=>f.number===floorNumber)?.slots.
     filter(s=>s.status==="available").length??0;
  }
 
  availableSectionSlots(floorNumber:number,section:string):number{
     return this.parkingSlots().filter(s=>s.floor===floorNumber && s.section===section && s.status==="available").length
  }

  filteredSlots(floorNumber: number, section: string,filterStatus:string,filterType:string): ParkingSlot[] {
    return this.parkingSlots().filter(s => {
      if (s.floor !== floorNumber || s.section !== section) return false;
      if (filterStatus !== 'all' && s.status !== filterStatus) return false;
      if (filterType !== 'all' && s.type !== filterType) return false;
      return true;
    });
  }

   private updateParkingSlot(slotId: string, changes: Partial<ParkingSlot>): void {
    this.parkingSlots.update(slots =>
      slots.map(s => s.id === slotId ? { ...s, ...changes } : s)
    );
  }

   bookParkingSlot(slotId: string, data: Omit<Booking, 'id' | 'slotId' | 'slotNumber' | 'startTime' | 'status'>): Booking {
    const slot = this.parkingSlots().find(s => s.id === slotId);
    if (!slot) throw new Error('Slot not found');
    if (slot.status !== 'available') throw new Error('Slot not available');

    const booking: Booking = {
      id: `BK${Date.now()}`,
      slotId,
      slotNumber: slot.number,
      startTime: new Date(),
      status: 'active',
      ...data,
    };

    this.bookings.update(b => [...b, booking]);
    this.updateParkingSlot(slotId, { status: 'occupied', booking });
    return booking;
  }

  checkOut(bookingId: string): Booking {
    const booking = this.bookings().find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    const endTime = new Date();
    const durationMs = endTime.getTime() - new Date(booking.startTime).getTime();
    const duration = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
    const slot = this.parkingSlots().find(s => s.id === booking.slotId);
    const totalCost = duration * (slot?.pricePerHour ?? 3);

    const updated: Booking = { ...booking, endTime, duration, totalCost, status: 'completed' };

    this.bookings.update(bs => bs.map(b => b.id === bookingId ? updated : b));
    this.updateParkingSlot(booking.slotId, { status: 'available', booking: undefined });
    return updated;
  }

  toggleMaintenance(slotId: string): void {
    const slot = this.parkingSlots().find(s => s.id === slotId);
    if (!slot || slot.status === 'occupied') return;
    const newStatus: SlotStatus = slot.status === 'maintenance' ? 'available' : 'maintenance';
    this.updateParkingSlot(slotId, { status: newStatus });
  }

  searchSlot(plate: string): ParkingSlot | undefined {
    const booking = this.bookings().find(
      b => b.vehiclePlate.toLowerCase() === plate.toLowerCase() && b.status === 'active'
    );
    if (!booking) return undefined;
    return this.parkingSlots().find(s => s.id === booking.slotId);
  }
   
   estimatedCost(booking: Booking): number {
    const slot = this.parkingSlots().find(s => s.id === booking.slotId);
    const hours = Math.max(1, Math.ceil((Date.now() - new Date(booking.startTime).getTime()) / 3600000));
    return hours * (slot?.pricePerHour ?? 3);
  }

  cancelBooking(bookingId: string): void {
    const booking = this.bookings().find(b => b.id === bookingId);
    if (!booking) return;
    this.bookings.update(bs => bs.map(b => b.id === bookingId ? { ...b, status: 'cancelled' } : b));
    this.updateParkingSlot(booking.slotId, { status: 'available', booking: undefined });
  }

}
 