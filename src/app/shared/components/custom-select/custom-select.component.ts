import { Component,input,signal,output } from '@angular/core';
import { SelectOption } from '../../../models/parking.model';

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
selectedOption=output<{option:SelectOption}>();

toggleDropdown() {
  this.isOpen.set(!this.isOpen())
}
selectOption(option:SelectOption){
  this.selectedOption.emit({option})
 this.toggleDropdown();
}
}
