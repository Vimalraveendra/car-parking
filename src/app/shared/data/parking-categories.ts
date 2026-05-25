import { SelectOption } from '../../models/parking.model';

export const PARKING_SLOTS:SelectOption[]= [
  { id:101,value: 'all', label: 'All slots' },
  { id:102,value: 'available', label: 'Available' },
  { id:103,value: 'occupied', label: 'Occupied' },
  { id:104,value: 'reserved', label: 'Reserved' },
  { id:105,value: 'maintenance', label: 'Maintenance' }
];

export const PARKING_TYPES:SelectOption[] = [
  { id:201,value: 'all', label: 'All types' },
  { id:202,value: 'standard', label: 'Standard' },
  { id:203,value: 'compact', label: 'Compact' },
  { id:204,value: 'disabled', label: 'Disabled' },
  { id:205,value: 'ev', label: 'EV' }
];

export const VEHICLE_TYPES:SelectOption[] = [
  { id:301,value: 'car', label: '🚗 Car' },
  { id:302,value: 'motorcycle', label: '🏍️ Motorcycle' },
  { id:303,value: 'van', label: '🚐 Van' },
  { id:304,value: 'ev', label: '⚡ EV' },
];