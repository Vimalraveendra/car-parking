import { Component,input,signal } from '@angular/core';
import { SelectOption } from '../../../app/models/parking.model';

@Component({
  selector: 'app-custom-select',
  imports: [],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss'
})
export class CustomSelectComponent {
options=input<SelectOption[]>([])
label=input<string>("")
isOpen =signal(false);

toggleDropdown() {
  this.isOpen.set(!this.isOpen())
}
}
