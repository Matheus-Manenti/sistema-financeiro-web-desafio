export class ClientResponseDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ClientResponseDTO>) {
    Object.assign(this, partial);
  }
}