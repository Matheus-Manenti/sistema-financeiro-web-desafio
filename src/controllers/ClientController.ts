import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ClientService } from 'src/service/ClientService';
import { ClientRequestDTO } from 'src/dtos/client/ClientRequestDTO';
import { UpdateClientRequestDTO } from 'src/dtos/client/UpdateClientRequestDTO';
import { ClientResponseDTO } from 'src/dtos/client/ClientResponse';

@Controller('/api/clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createClientDto: ClientRequestDTO): Promise<ClientResponseDTO> {
    return this.clientService.create(createClientDto);
  }

  @Get('/list-all')
  async findAll(): Promise<ClientResponseDTO[]> {
    return this.clientService.findAll();
  }

  @Get('list-by-email/:email')
    async findByEmail(@Param('email') email: string): Promise<ClientResponseDTO> {
    return this.clientService.findByEmail(email);
  }

  @Get('/list-by-id/:id')
  async findById(@Param('id') id: string): Promise<ClientResponseDTO> {
    return this.clientService.findById(id);
  }

  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() data: UpdateClientRequestDTO): Promise<ClientResponseDTO> {
    return this.clientService.update(id, data);
  }

  @Patch('/update-status/:id')
  async toggleStatus(@Param('id') id: string): Promise<ClientResponseDTO> {
    return this.clientService.toggleStatus(id);
  }
}