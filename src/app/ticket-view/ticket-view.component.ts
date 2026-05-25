import { Component, inject, signal } from '@angular/core';
import { ParkingService } from '../services/parking.service';
import { Booking } from '../models/parking.model';

@Component({
  selector: 'app-ticket-view',
  imports: [],
  templateUrl: './ticket-view.component.html',
  styleUrl: './ticket-view.component.scss'
})
export class TicketViewComponent {
  private parkingService=inject(ParkingService);
   activeTab = signal<'active' | 'completed'>('active');
  selectedTicket = signal<Booking | null>(null);

  activeBookings = this.parkingService.activeBookings();
  completedBookings = this.parkingService.completedBookings();
  totalRevenue = this.parkingService.totalRevenue();

  estimatedCost(booking: Booking) {
    return this.parkingService.estimatedCost(booking);
  } 
  vehicleIcon(type: string): string {
    return this.parkingService.getIcon(type);
  }

  checkout(bookingId: string) {
    this.parkingService.checkOut(bookingId);
  }
  cancel(bookingId: string) {
    this.parkingService.cancelBooking(bookingId);
  }
}
