import OrderItem from "./oder_item";
import Order from "./order";

describe("Order unit tests", () => {

    it("should throw error when id is empty", () => {

        expect(() => {

            let order = new Order("", "123", []);

        }).toThrowError("Id is required");

    });

    it("should throw error when customerID is empty", () => {

        expect(() => {

            let order = new Order("123", "", []);

        }).toThrowError("CustomerId is required");

    });

    it("should throw error when item qtd is lower than 0", () => {

        expect(() => {

            let order = new Order("123", "123", []);

        }).toThrowError("Items are required");

    });

    it("should calculate total", () => {

       const item = new OrderItem("i1", "Item 1", 100, "p1", 2);
       const item2 = new OrderItem("i2", "Item 2", 200, "p2", 2);

       const order = new Order("o1", "c1", [item]);

       let total = order.total();

       expect(total).toBe(200);

       const order2 = new Order("o1", "c1", [item, item2]);

       total = order2.total();

       expect(total).toBe(600);
    });

    it("should throw error if the item qte is less or equal zero", () => {

        expect(() => {

            const item = new OrderItem("i1", "Item 1", 100, "p1", 0);
            const order = new Order("o1", "c1", [item]);

        }).toThrowError("Quantity must be greater than 0");

    });
    
});