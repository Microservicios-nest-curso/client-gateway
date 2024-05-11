import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus, OrderStatusList } from "../enum/order.enum";

export class ChangeOrderStatusDto{


    @IsEnum(OrderStatusList, {
        message: `status must be one of ${Object.values(OrderStatusList).join(', ')}`
    })
    status: OrderStatus = OrderStatus.PENDING
}