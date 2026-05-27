import { Component, inject, signal } from '@angular/core';
import { ParkingService } from '../services/parking.service';
import { Booking } from '../models/parking.model';
import { DatePipe,CurrencyPipe } from '@angular/common';
import { ElapsedTimePipe } from '../pipes/elapsed-time.pipe';
import { ReceiptModalComponent } from "./receipt-modal/receipt-modal.component";

@Component({
  selector: 'app-ticket-view',
  imports: [DatePipe, CurrencyPipe, ElapsedTimePipe, ReceiptModalComponent],
  templateUrl: './ticket-view.component.html',
  styleUrl: './ticket-view.component.scss'
})
export class TicketViewComponent {
  private parkingService=inject(ParkingService);
   activeTab = signal<'active' | 'completed'>('active');
  selectedTicket = signal<Booking | null>(null);

  activeBookings = this.parkingService.activeBookings;
  completedBookings = this.parkingService.completedBookings;
  totalRevenue = this.parkingService.totalRevenue;

  estimatedCost(booking: Booking) {
    return this.parkingService.estimatedCost(booking);
  } 
  vehicleIcon(type: string): string {
    return this.parkingService.getIcon(type);
  }

  checkOut(bookingId: string) {
    this.parkingService.checkOut(bookingId);
  }
  cancelBooking(bookingId: string) {
    this.parkingService.cancelBooking(bookingId);
  }
  closeModalReceipt(){
    this.selectedTicket.set(null);
  }
}
