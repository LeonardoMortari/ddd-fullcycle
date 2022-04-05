
import { where } from "sequelize/types";
import OrderItem from "../../../../domain/checkout/entity/oder_item";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create(
            {
                id: entity.id,
                customer_id: entity.customerId,
                total: entity.total(),
                items: entity.items.map((item) => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    product_id: item.productId,
                    quantity: item.quantity,
                }))
            },
            {
                include: [{model: OrderItemModel}],
            }
        );
    }

    async update(entity: Order): Promise<void> {

        const sequelize = OrderModel.sequelize;
    
        await sequelize.transaction(async (t) => {
            await OrderItemModel.destroy({
                where: { 
                    order_id: entity.id 
                },
                transaction: t,
            });
        
            const items = entity.items.map((item) => ({
                id: item.id,
                name: item.name,
                price: item.price,
                product_id: item.productId,
                quantity: item.quantity,
                order_id: entity.id
                })
            );

            await OrderItemModel.bulkCreate(
                items, 
                { 
                    transaction: t 
                }
            );
        
            await OrderModel.update(
                { 
                    total: entity.total()                    },
                { 
                    where: { id: entity.id },
                    transaction: t,
                }
            );
      
            
        });
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: {
                id: id,
            },
            include: ["items"]
        });

        let items: OrderItem[] = [];
        let orderItem;

        orderModel.items.forEach((item) => {
            orderItem = new OrderItem(
                item.id, 
                item.name,
                item.price / item.quantity,
                item.product_id,
                item.quantity
            );   

            items.push(orderItem);
        }); 

        const order = new Order(orderModel.id, orderModel.customer_id, items);

        return order;
    }

    async findAll(): Promise<Order[]> {
        const lstOrders = await OrderModel.findAll({
            include: ["items"],
        });
       
        let orders: Order[] = [];
        let lstOrderItems: OrderItem[] = [];
        let orderItem;

        lstOrders.map((order) => {
            lstOrderItems = [];

            order.items.forEach((item) => {
                orderItem = new OrderItem(
                    item.id, 
                    item.name,
                    item.price / item.quantity,
                    item.product_id,
                    item.quantity
                );   
    
                lstOrderItems.push(orderItem);
            }); 
    
            orders.push(new Order(order.id, order.customer_id, lstOrderItems));
        });

        return orders;
    }

}