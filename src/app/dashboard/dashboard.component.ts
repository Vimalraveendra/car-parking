import { Component, inject } from '@angular/core';
import { ParkingService } from '../../services/parking.service.ts.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CurrencyPipe,DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private parkingService= inject(ParkingService)

  parkingStatus= this.parkingService.parkingStats

  parkingFloors = this.parkingService.floors

  activeBookings = this.parkingService.activeBookings;

    getVehicleIcon(type: string): string {
    const icons: Record<string, string> = {
      car: '🚗', motorcycle: '🏍️', van: '🚐', ev: '⚡'
    };
    return icons[type] ?? '🚗';
  }


}
