import { Component, inject } from '@angular/core';
import { ParkingService } from '../../services/parking.service.ts.service';

@Component({
  selector: 'app-dashboard',
  standalone:true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  private parkingService= inject(ParkingService)

  parkingStatus= this.parkingService.parkingSlots$

  parkingFloors = this.parkingService.floors

}
