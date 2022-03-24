import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class SendLogWhenCustomerChangeAddressHandler
    implements EventHandlerInterface<CustomerChangeAddressEvent> {

        handle(event: CustomerChangeAddressEvent): void {
            const objeto = event.eventData;

            console.log(`Endereço do cliente: ${objeto.customer_id}, ${objeto.customer_name} alterado para: ` +
                        `\n Rua : ${objeto.address.street}` + 
                        `\n Número : ${objeto.address.number}` + 
                        `\n Código Postal : ${objeto.address.zip}` +
                        `\n Cidade : ${objeto.address.city}`);
        }
}