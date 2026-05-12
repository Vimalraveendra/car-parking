import { Component, inject } from '@angular/core';
import { ParkingService } from '../../services/parking.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FloorOccupiedPipe } from '../../pipes/floor-occupied.pipe';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [CurrencyPipe,DatePipe,FloorOccupiedPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private parkingService= inject(ParkingService)

  parkingStatus= this.parkingService.parkingStats

  parkingFloors = this.parkingService.floors

  activeBookings = this.parkingService.activeBookings;

   getVehicleIcon(type: string){
     return this.parkingService.getIcon(type)
   }
 
}
