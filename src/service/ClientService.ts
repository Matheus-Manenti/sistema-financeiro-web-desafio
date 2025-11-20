import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/PrismaService';
import { ClientResponseDTO } from 'src/dtos/client/ClientResponse';
import { ClientRequestDTO } from 'src/dtos/client/ClientRequestDTO';
import { FinancialStatus } from 'src/dtos/client/FinancialStatus';
import { UpdateClientRequestDTO } from 'src/dtos/client/UpdateClientRequestDTO';
import { ClientConflictException } from 'src/exceptions/client-conflict.exception';
import { ClientNotFoundException } from 'src/exceptions/client-not-found.exception';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly clientInclude = {
    orders: true,
  };

  async updateFinancialStatus(id: string, financialStatus: FinancialStatus): Promise<ClientResponseDTO> {
    const updatedClient = await this.prisma.client.update({
      where: { id: id },
      data: { financialStatus: financialStatus },
      include: this.clientInclude,
    });
    return this._mapToClientResponseDTO(updatedClient);
  }

  private _mapToClientResponseDTO(
    client: Prisma.ClientGetPayload<{ include: { orders: true } }>,
  ): ClientResponseDTO {
    return new ClientResponseDTO({
      ...client,
      financialStatus: client.financialStatus as FinancialStatus,
    });
  }

  private _calculateFinancialStatus(
    client: Prisma.ClientGetPayload<{ include: { orders: true } }>,
  ): FinancialStatus {
    const hasVencidaOrder = client.orders.some((order: any) => {
      const now = new Date();
      let validityStatus: string;
      if (now < order.startDate) {
        validityStatus = 'FUTURA';
      } else if (now > order.endDate && !order.isPaid) {
        validityStatus = 'VENCIDA';
      } else {
        validityStatus = 'VIGENTE';
      }
      return validityStatus === 'VENCIDA';
    });
    return hasVencidaOrder
      ? FinancialStatus.INADIMPLENTE
      : FinancialStatus.ADIMPLENTE;
  }

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
      include: this.clientInclude, 
    });

    return this._mapToClientResponseDTO(client);
  }

  async findAll(): Promise<ClientResponseDTO[]> {
    const clients = await this.prisma.client.findMany({
      include: this.clientInclude,
      orderBy: [
        { financialStatus: 'asc' }, // ADIMPLENTE antes de INADIMPLENTE
        { createdAt: 'desc' },      // Mais recente primeiro
      ],
    });
    return clients.map((client) => this._mapToClientResponseDTO(client));
  }

  async findById(id: string): Promise<ClientResponseDTO> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: this.clientInclude,
    });
    if (!client) {
      throw new ClientNotFoundException();
    }
    return this._mapToClientResponseDTO(client);
  }

  async findByEmail(email: string): Promise<ClientResponseDTO> {
    const client = await this.prisma.client.findUnique({
      where: { email },
      include: this.clientInclude,
    });
    if (!client) {
      throw new ClientNotFoundException();
    }
    return this._mapToClientResponseDTO(client);
  }

  async update(
    id: string,
    data: UpdateClientRequestDTO,
  ): Promise<ClientResponseDTO> {

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
      include: this.clientInclude,
    });

    return this._mapToClientResponseDTO(updatedClient);
  }

  async toggleStatus(id: string): Promise<ClientResponseDTO> {
    const client = await this.prisma.client.findUnique({
      where: { id },
      include: this.clientInclude,
    });

    if (!client) {
      throw new ClientNotFoundException();
    }

    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: {
        isActive: !client.isActive,
        canceledAt: !client.isActive ? new Date() : null,
      },
      include: this.clientInclude,
    });

    return this._mapToClientResponseDTO(updatedClient);
  }

  async toggleFinancialStatus(id: string): Promise<ClientResponseDTO> {
    const client = await this.prisma.client.findUnique({ where: { id } });
    if (!client) throw new ClientNotFoundException();
    const newStatus = client.financialStatus === 'ADIMPLENTE' ? 'INADIMPLENTE' : 'ADIMPLENTE';
    const updatedClient = await this.prisma.client.update({
      where: { id },
      data: { financialStatus: newStatus },
      include: this.clientInclude,
    });
    return this._mapToClientResponseDTO(updatedClient);
  }
}