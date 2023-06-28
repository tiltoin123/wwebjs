import { ChatLogs, PrismaClient } from "@prisma/client";

export interface IChatLogsRepository {
  createChatLog(chatLogData: ChatLogs): Promise<ChatLogs>;
  getChatLogsByUserAndStore(userNumber:string,storeId:number): Promise<ChatLogs[]>;
  getLastChatLogs(userNumber:string, storeId:number): Promise<ChatLogs | null>;
}

export class PrismaChatLogsRepository implements IChatLogsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createChatLog(chatLogData: ChatLogs): Promise<ChatLogs> {
    try{
      //console.debug("Inserting data into ChatLogs table");
    const createdChatLog = await this.prisma.chatLogs.create({
      data: {
        message: chatLogData.message,
        contactId: chatLogData.contactId,
        storeId: chatLogData.storeId,
        messageType: chatLogData.messageType,
        senderNumber: chatLogData.senderNumber,
        recipientNumber: chatLogData.recipientNumber,
        templateId: chatLogData.templateId
      },

    });
    console.info("Chat log created", createdChatLog);
    return createdChatLog;}catch(error){
      console.error("An error occurred creating the chatlog",error)
      throw error
    }finally {
      await this.prisma.$disconnect();
    }
  }

  async getChatLogsByUserAndStore(userNumber:string, storeId:number): Promise<ChatLogs[]> {
    try{
    
    const chatLogs = await this.prisma.chatLogs.findMany({
      where: {
        OR: [
          { recipientNumber: userNumber },
          { senderNumber: userNumber },
        ],
        storeId: storeId,
      },
      orderBy: {
        id: 'desc',
      },
      take: 5,
    
    });

    return chatLogs;
  }catch(error){
    console.error("Error ocurred while fetching the chatlogs",error)
    throw error
  }finally {
    await this.prisma.$disconnect();
  }
  }

  async getLastChatLogs(userNumber:string, storeId:number): Promise<ChatLogs | null> {
    try{

    const chatLogs = await this.prisma.chatLogs.findFirst({
      where: { senderNumber: userNumber, storeId: storeId },
      orderBy: {
        createdAt: "desc"
      }
    });

    return chatLogs;
  }catch(error){
    console.error("Error ocurred while fetching the chatlogs",error)
      throw error
  }finally {
    await this.prisma.$disconnect();
  }
}
}