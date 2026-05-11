export type SlotType = 'standard' | 'compact' | 'disabled' | 'ev';
export type SlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type VehicleType = 'car' | 'motorcycle' | 'van' | 'ev';

export interface ParkingSlot {
  id: string;
  number: string;
  floor: number;
  section: string;
  type: SlotType;
  status: SlotStatus;
  booking?: Booking;
  pricePerHour: number;
}

export interface Booking {
  id: string;
  slotId: string;
  slotNumber: string;
  vehiclePlate: string;
  vehicleType: VehicleType;
  ownerName: string;
  ownerPhone: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  totalCost?: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface ParkingStats {
  total: number;
  available: number;
  occupied: number;
  reserved: number;
  maintenance: number;
  revenue: number;
  occupancyRate: number;
}

export interface Floor {
  number: number;
  label: string;
  slots: ParkingSlot[];
}

export interface SelectOption {
  id:number,
  value: string;
  label: string;
}