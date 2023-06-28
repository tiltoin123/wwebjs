import { PrismaContactsRepository } from "../GetAllRepository/GetAllContacts";
import { PrismaChatLogsRepository } from "../GetAllRepository/GetAllChatLogs";
import { PrismaStoresRepository } from "../GetAllRepository/GetAllStore";
import { PrismaTemplatesRepository } from "../GetAllRepository/GetAllTemplates";

class GetAllData {
    constructor(
        private getStoreData: PrismaStoresRepository,
        private getContactData: PrismaContactsRepository,
        private getChatLogsData: PrismaChatLogsRepository,
        private getTemplateData: PrismaTemplatesRepository
    ) {}

    async dataGetter(message) {
        let store = await this.getStoreData.getStoreByPhoneNumber(message.to);
        let contact = await this.getContactData.getContactByNumberAndStoreId(message.from, store.id);
        let template = await this.getTemplateData.getTemplatesByStoreId(store.id);
        let contactStoreConversation = await this.getChatLogsData.getChatLogsByUserAndStore(message.from, store.id);
        let lastMessage = await this.getChatLogsData.getLastChatLogs(message.from, store.id);

        return {
            store,
            contact,
            template,
            contactStoreConversation,
            lastMessage
        };
    }
}

export default GetAllData;