import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { NatsModule } from './transport/nats.module';

@Module({
  imports: [ProductsModule, OrdersModule, NatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
