import { Order } from '@prisma/client';
import { ValidityStatus } from './ValidityStatus';

export class OrderResponseDTO {
  id: string;
  description: string;
  value: number;
  startDate: Date;
  endDate: Date;
  isPaid: boolean;
  isActive: boolean;
  paidAt: Date | null;
  validityStatus: ValidityStatus;
  createdAt: Date;
  updatedAt: Date;
  clientId: string;
  startDateFormatted?: string;
  endDateFormatted?: string;

  constructor(order: Order, validityStatus: ValidityStatus) {
    this.id = order.id;
    this.description = order.description;
    this.value = order.value;
    this.startDate = order.startDate;
    this.endDate = order.endDate;
    this.isPaid = order.isPaid;
    this.isActive = order.isActive;
    this.paidAt = order.paidAt;
    this.validityStatus = validityStatus;
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
    this.clientId = order.clientId;
    this.startDateFormatted = '';
    this.endDateFormatted = '';
  }
}
