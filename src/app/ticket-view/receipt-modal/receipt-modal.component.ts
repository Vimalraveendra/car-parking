import { Component, input } from '@angular/core';
import { Booking } from '../../models/parking.model';

@Component({
  selector: 'app-receipt-modal',
  imports: [],
  templateUrl: './receipt-modal.component.html',
  styleUrl: './receipt-modal.component.scss'
})
export class ReceiptModalComponent {
  activeTab=input<'active' | 'completed'|null>(null);
  selectedTicket=input<Booking | null>(null);

}
