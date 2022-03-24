
import CustomerChangeAddressEvent from "../../customer/event/customer-change-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendLogWhenCustomerChangeAddressHandler from "../../customer/event/handler/send-log-when-customer-change-address.handler";
import SendLogWhenCustomerIsCreatedHandler from "../../customer/event/handler/send-log-when-customer-is-created.handler";
import SendLog2WhenCustomerIsCreatedHandler from "../../customer/event/handler/send-log2-when-customer-is-created.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

    it("should register an event handler", () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
    });
    
    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should untegister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        });

        // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    // Testes para os Domain Events do CUSTOMER
    it("should notify when customer is created", async() => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCustomerIsCreatedHandler();
        const eventHandler2 = new SendLog2WhenCustomerIsCreatedHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
        //expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler)

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            description: "Customer 1 description"
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });

    it("should notify when customer change address", async() => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendLogWhenCustomerChangeAddressHandler();

        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerChangeAddressEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]).toMatchObject(eventHandler);

        const address = new Address("Nova rua", 123, "Zipcode novo", "Cidade nova");

        const customerChangeAddress = new CustomerChangeAddressEvent({
            customer_id: "123",
            customer_name: "Customer 2",
            address: address
        });

        eventDispatcher.notify(customerChangeAddress);

        expect(spyEventHandler).toHaveBeenCalled();
    });
});