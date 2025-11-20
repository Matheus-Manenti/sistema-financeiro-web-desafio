import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/JwtAuthGuard';
import { Roles } from 'src/auth/RolesDecorator';
import { RolesGuard } from 'src/auth/RolesGuard';
import { OrderRequestDTO } from 'src/dtos/order/OrderRequestDTO';
import { OrderResponseDTO } from 'src/dtos/order/OrderResponseDTO';
import { UpdateOrderRequestDTO } from 'src/dtos/order/UpdateOrderRequestDTO';
import { OrderService } from 'src/service/OrderService';
import { ClientService } from 'src/service/ClientService';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly clientService: ClientService,
  ) {}

  @Post('/create')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: OrderRequestDTO): Promise<OrderResponseDTO> {
    return this.orderService.create(data);
  }

  @Get('/list-all')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findAll(): Promise<OrderResponseDTO[]> {
    return this.orderService.findAll();
  }

  @Get('/client/:clientId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findByClient(
    @Param('clientId') clientId: string,
  ): Promise<OrderResponseDTO[]> {
    return this.orderService.findByClientId(clientId);
  }

  @Patch('/:orderId/toggle-payment')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  async togglePaymentStatus(
    @Param('orderId') orderId: string,
  ): Promise<{ order: OrderResponseDTO, client: any }> {
    const order = await this.orderService.togglePaymentStatus(orderId);
    const client = await this.clientService.findById(order.clientId);
    return { order, client };
  }

  @Patch('update/:orderId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('orderId') orderId: string,
    @Body() data: UpdateOrderRequestDTO,
  ): Promise<OrderResponseDTO> {
    return this.orderService.update(orderId, data);
  }

  @Patch('update-status/:orderId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  async toggleActivity(
    @Param('orderId') orderId: string,
  ): Promise<OrderResponseDTO> {
    return this.orderService.toggleActivity(orderId);
  }
}


