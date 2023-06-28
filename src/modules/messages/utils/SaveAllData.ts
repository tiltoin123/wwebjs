import GetAllData from "./GetAllData";
import { PrismaContactsRepository } from "../GetAllRepository/GetAllContacts";
import { PrismaChatLogsRepository } from "../GetAllRepository/GetAllChatLogs";


class SaveAllData {
    constructor(
        private getAllData: GetAllData,
        private saveContactData:PrismaContactsRepository,
        private saveChatLogData:PrismaChatLogsRepository
    ) {}

    async saveData(message) {

        const data = await this.getAllData.dataGetter(message);

        if (!data.contact || !data.contact.id) {
            let contact = await this.saveContactData.createContact(<any>{
              name: message.notifyName,
              phoneNumber: message.from,
              sessionId: message.id,
              storeId: data.store.id
            })
          }

          this.saveChatLogData.createChatLog(<any>{
            senderNumber: message.from,
            recipientNumber: data.store.phone,
            message: message.Body,
            storeId: data.store.id,
            contactId: data.contact!.id,
            messageType: 'request',
            templateId: 0
          })

    }
}

export default SaveAllData;
