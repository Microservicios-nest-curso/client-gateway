import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseFilters } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) { }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.client.send({ cmd: 'create-product' }, createProductDto).pipe(
      catchError(error => { throw new RpcException(error) })
    );
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    //** Nota: send: envia petición y espera respuesta
    //** emit : solo envia y sigue con su vida
    try {
      return  await firstValueFrom(this.client.send({ cmd: 'find-all-products' }, paginationDto));
    } catch (error) {
      throw new RpcException(error);
    }
  }



  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      //Other option without try catch
      //return this.productClient.send({ cmd: 'find-one-product' }, { id }).pipe(catchError(error =>{throw new RpcException(error)}))
      const product = await firstValueFrom(this.client.send({ cmd: 'find-one-product' }, { id }));
      return product;

    } catch (error) {
      throw new RpcException(error)
      // throw new NotFoundException(error);
    }

  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      updateProductDto.id = id;
      return this.client.send({ cmd: 'update-product' }, updateProductDto);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.client.send({ cmd: 'delete-product' }, { id }).pipe(
      catchError(error => { throw new RpcException(error) })
    );

  }
}
