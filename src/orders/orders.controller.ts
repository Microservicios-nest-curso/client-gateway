import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseIntPipe, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto/change-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send( 'create-order', createOrderDto).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send( 'find-all-orders',orderPaginationDto).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find-one-order',{id}).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }

  @Patch(':id')
  changeOrderStatus(@Param('id', ParseUUIDPipe) id:string,  @Query() changeOrderStatus:ChangeOrderStatusDto) {
    const {status } = changeOrderStatus;
    return this.client.send('change-order-status',{id,status}).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }


}
