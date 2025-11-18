
import { ClientRequestDTO } from 'src/dtos/client/ClientRequestDTO';
import { UpdateClientRequestDTO } from 'src/dtos/client/UpdateClientRequestDTO';
import { ClientNotFoundException } from 'src/exceptions/client-not-found.exception';
import { ClientConflictException } from 'src/exceptions/client-conflict.exception';
import { ClientResponseDTO } from 'src/dtos/client/ClientResponse';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/PrismaService';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly clientSelect = {
    id: true,
    name: true,
    email: true,
    phone: true,
    isActive: true,
    createdAt: true,
    updatedAt: true,
  };

  async create(data: ClientRequestDTO): Promise<ClientResponseDTO> {
    if (data.email) {
      const existingClient = await this.prisma.client.findUnique({
        where: { email: data.email },
      });
      if (existingClient) {
        throw new ClientConflictException();
      }
    }

    const client = await this.prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    });

    return new ClientResponseDTO(client);
  }

  async findAll(): Promise<ClientResponseDTO[]> {
    const clients = await this.prisma.client.findMany({
      select: this.clientSelect,
    });
    return clients.map(client => new ClientResponseDTO(client));
  }

  async findById(id: string): Promise<ClientResponseDTO> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      select: this.clientSelect,
    });
    if (!client) {
      throw new ClientNotFoundException();
    }
    return new ClientResponseDTO(client);
  }

  async findByEmail(email: string): Promise<ClientResponseDTO> {
    const client = await this.prisma.client.findUnique({
      where: { email },
      select: this.clientSelect,
    });
    if (!client) {
      throw new ClientNotFoundException();
    }
    return new ClientResponseDTO(client);
  }

  async update(id: string, data: UpdateClientRequestDTO): Promise<ClientResponseDTO> {
    await this.findById(id); 

    if (data.email) {
      const ownerOfEmail = await this.prisma.client.findUnique({
        where: { email: data.email },
      });
      if (ownerOfEmail && ownerOfEmail.id !== id) {
        throw new ClientConflictException();
      }
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: data,
      select: this.clientSelect,
    });

    return new ClientResponseDTO(updatedClient);
  }

  async toggleStatus(id: string): Promise<ClientResponseDTO> {
    const client = await this.findById(id);

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: { isActive: !client.isActive },
      select: this.clientSelect,
    });

    return new ClientResponseDTO(updatedClient);
  }
}