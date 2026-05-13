import { Component, inject ,input, output, signal} from '@angular/core';
import { FormGroup,FormControl,Validators ,ReactiveFormsModule, MaxLengthValidator} from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { Booking, ParkingSlot } from '../models/parking.model';
import { CustomSelectComponent } from '../../shared/components/custom-select/custom-select.component';
import { VEHICLE_TYPES } from '../../shared/data/parking-categories';

@Component({
  selector: 'app-booking-modal',
  standalone:true,
  imports: [ReactiveFormsModule,CustomSelectComponent],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss'
})
export class BookingModalComponent {
  private parkingService= inject(ParkingService);
  parkingSlot=input<ParkingSlot|null>(null);
   submitting = false;
   closed =output<void>();
   booked=output<Booking>();
  optionsType=VEHICLE_TYPES;
  selectVehicleType=signal({label:'🚗 Car',value:'car'})

   bookingForm:FormGroup= new FormGroup({
    ownerName:new FormControl('',[Validators.required]),
    ownerPhone:new FormControl("",[Validators.required]),
    vehiclePlate:new FormGroup("",[Validators.required]),
    vehicleType:new FormControl("car",[Validators.required])
  })
   onClose(): void {
    this.closed.emit();
  }

}
