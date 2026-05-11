import { Component } from '@angular/core';
import { CustomSelectComponent } from '../shared/components/custom-select/custom-select.component';
import { PARKING_SLOTS, PARKING_TYPES } from '../shared/data/parking-categories';

@Component({
  selector: 'app-parking-grid',
  standalone:true,
  imports: [CustomSelectComponent],
  templateUrl: './parking-grid.component.html',
  styleUrl: './parking-grid.component.scss'
})
export class ParkingGridComponent {
  optionsData=PARKING_SLOTS;
  optionsType=PARKING_TYPES;

}
