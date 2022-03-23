import Order from "../../domain/entity/order";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItem from "../../domain/entity/oder_item";
import { where } from "sequelize/types";

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
        await OrderModel.update(
            {
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
                where: {
                    id: entity.id
                }
            },
        );
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