import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ParkingGridComponent } from '../parking-grid/parking-grid.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
     { path: 'parking', component: ParkingGridComponent },
    { path: '**', redirectTo: 'dashboard' },
];
