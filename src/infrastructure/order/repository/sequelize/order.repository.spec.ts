import { Sequelize } from "sequelize-typescript";
import OrderItem from "../../../../domain/checkout/entity/oder_item";
import Order from "../../../../domain/checkout/entity/order";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);

        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
           "1",
           product.name,
           product.price,
           product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123",
                },
            ],
        });
    });

    it("should update a order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const productNew = new Product("12", "Product 2", 5);
        await productRepository.create(productNew);

        const orderItem2 = new OrderItem(
            "2",
            productNew.name,
            productNew.price,
            productNew.id,
            5
        );

        order.changeItems([orderItem2]);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: "123",
                    product_id: orderItem2.productId,
                },
            ],
        });
    });

    it("should find a order", async() => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 30);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderResult = await orderRepository.find(order.id);
        expect(order).toStrictEqual(orderResult);
    });

    it("should find all orders", async() => {
        const customerRepository = new CustomerRepository();
        const customer_1 = new Customer("123", "Customer 1");
        const address_1 = new Address("Street 1", 1, "Zipcode 1", "City 1");
        customer_1.changeAddress(address_1);

        const customer_2 = new Customer("456", "Customer 2");
        const address_2 = new Address("Street 2", 2, "Zipcode 2", "City 2");
        customer_2.changeAddress(address_2);

        await customerRepository.create(customer_1);
        await customerRepository.create(customer_2);

        const productRepository = new ProductRepository();
        const product_1 = new Product("123", "Product 1", 30);
        const product_2 = new Product("456", "Product 2", 20);

        await productRepository.create(product_1);
        await productRepository.create(product_2);

        const orderItem_1 = new OrderItem(
            "1",
            product_1.name,
            product_1.price,
            product_1.id,
            2
        );

        const orderItem_2 = new OrderItem(
            "2",
            product_2.name,
            product_2.price,
            product_2.id,
            4
        );

        const order_1 = new Order("123", "123", [orderItem_1]);
        const order_2 = new Order("456", "456", [orderItem_2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order_1);
        await orderRepository.create(order_2);

        const orderResult = await orderRepository.findAll();

        expect(orderResult).toHaveLength(2);
        expect(orderResult).toContainEqual(order_1);
        expect(orderResult).toContainEqual(order_2);
    });
});