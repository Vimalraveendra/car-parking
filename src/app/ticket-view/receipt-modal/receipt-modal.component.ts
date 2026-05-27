import { Component, input,output } from '@angular/core';
import { Booking } from '../../models/parking.model';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-receipt-modal',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './receipt-modal.component.html',
  styleUrl: './receipt-modal.component.scss'
})
export class ReceiptModalComponent {
  selectedTicket=input<Booking | null>(null);
  close=output<void>();

  closeModal(){
    this.close.emit();
  }

}
