import { Component, inject ,input, OnInit, output, signal} from '@angular/core';
import { FormGroup,FormControl,Validators ,ReactiveFormsModule, MaxLengthValidator, FormControlName} from '@angular/forms';
import { ParkingService } from '../../services/parking.service';
import { Booking, ParkingSlot, SelectOption } from '../models/parking.model';
import { CustomSelectComponent } from '../../shared/components/custom-select/custom-select.component';
import { VEHICLE_TYPES } from '../../shared/data/parking-categories';

@Component({
  selector: 'app-booking-modal',
  standalone:true,
  imports: [ReactiveFormsModule,CustomSelectComponent],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.scss'
})
export class BookingModalComponent implements OnInit {

  private parkingService= inject(ParkingService);
  parkingSlot=input<ParkingSlot|null>(null);
   submitting = false;
   closed =output<void>();
   booked=output<Booking>();
  optionsType=VEHICLE_TYPES;
  selectVehicleType=signal({label:'🚗 Car',value:'car'})
    submitted = false;

   bookingForm:FormGroup= new FormGroup({
    name:new FormControl('',[Validators.required,Validators.minLength(3)]),
    phone:new FormControl("",[Validators.required,Validators.minLength(14),Validators.maxLength(14)]),
    vehiclePlate:new FormControl("",[Validators.required,Validators.minLength(8),Validators.maxLength(8)]),
  })
 
    ngOnInit(): void {
   this.bookingForm.get("phone")?.valueChanges.subscribe(value=>{  
      if(!value) return;
       // only numbers
    let cleaned = value.replace(/\D/g, '');  

    let formatted = cleaned.match(/^.{0,2}|.{1,3}/g)?.join(' ')||" "
 if (formatted!== value) {
        this.bookingForm.get("phone")?.setValue(formatted, {
          emitEvent: false
        });
      }
   })
    this.bookingForm.get("vehiclePlate")?.valueChanges.subscribe(value=>{  
      if(!value) return;

      // letters and numbers only
    let cleaned = value.replace(/[^a-zA-Z0-9]/g, '')
      
      // first 3 must be letters only
  let part1 = cleaned.slice(0, 3).replace(/[^a-zA-Z]/g, '');
   // rest must be numbers only
  let part2 = cleaned.slice(3).replace(/[^0-9]/g, '');
    let formatted = part1;

  if (part2.length > 0) {
    formatted += '-' + part2;
  }
 if (formatted!== value) {
        this.bookingForm.get("vehiclePlate")?.setValue(formatted, {
          emitEvent: false
        });
      }
   })
  
  }
   onClose(): void {
    this.closed.emit();
  }
 
  isFieldInvalid(controlName:string):boolean{
    const controlForm= this.bookingForm.get(controlName)
     return !!( controlForm?.invalid && (controlForm?.dirty || controlForm?.touched||this.submitted))
    
  }

  setSelectedVehicleType(option:SelectOption){
     const {label,value}=option
     this.selectVehicleType.set({label,value})
  }
  onSubmit(){
  if(this.bookingForm.invalid){
    console.log("Invalid Form")
     this.bookingForm.markAllAsTouched();
    return;
  }
  console.log(this.bookingForm)
  this.submitted=true;
}

}
