import { Component, inject, signal } from '@angular/core';
import { ParkingService } from '../services/parking.service';
import { Booking } from '../app/models/parking.model';

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

}
