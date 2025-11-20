import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { ClientResponseDTO } from 'src/dtos/client/ClientResponse';
import { ClientRequestDTO } from 'src/dtos/client/ClientRequestDTO';
import { UpdateClientRequestDTO } from 'src/dtos/client/UpdateClientRequestDTO';
import { ClientService } from 'src/service/ClientService';
import { RolesGuard } from 'src/auth/RolesGuard';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { FinancialStatus } from 'src/dtos/client/FinancialStatus';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/create')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: ClientRequestDTO): Promise<ClientResponseDTO> {
    return this.clientService.create(createClientDto);
  }

  @Get('/list-all')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findAll(): Promise<ClientResponseDTO[]> {
    return this.clientService.findAll();
  }

  @Get('list-by-email/:email')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findByEmail(@Param('email') email: string): Promise<ClientResponseDTO> {
    return this.clientService.findByEmail(email);
  }

  @Get('/list-by-id/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findById(@Param('id') id: string): Promise<ClientResponseDTO> {
    return this.clientService.findById(id);
  }

  @Patch('/update/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async update(@Param('id') id: string, @Body() data: UpdateClientRequestDTO): Promise<ClientResponseDTO> {
    return this.clientService.update(id, data);
  }

  @Patch('/update-status/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async toggleStatus(@Param('id') id: string): Promise<ClientResponseDTO> {
    return this.clientService.toggleStatus(id);
  }

  @Patch('/update-financial-status/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async updateFinancialStatus(
    @Param('id') clientId: string,
    @Body() data: { financialStatus: string }
  ): Promise<ClientResponseDTO> {
    
    return this.clientService.updateFinancialStatus(clientId, data.financialStatus as FinancialStatus);
  }

  @Patch('/toggle-financial-status/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async toggleFinancialStatus(@Param('id') clientId: string): Promise<ClientResponseDTO> {
    return this.clientService.toggleFinancialStatus(clientId);
  }
}