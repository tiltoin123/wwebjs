import { Contacts, PrismaClient } from "@prisma/client";

export interface IContactsRepository {
  getContactByNumberAndStoreId(phoneNumber: string, storeId: number): Promise<Contacts | null>;
  createContact(contactData: Contacts, storeid: number): Promise<Contacts>;
  updateContact(id:number,name:string):Promise<Contacts>;
  getContactByPhoneNumber(phoneNumber:string):Promise<Contacts>
}

export class PrismaContactsRepository implements IContactsRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getContactByNumberAndStoreId(phoneNumber: string, storeId: number): Promise<Contacts | null> {


    console.debug("getContactByNumberAndSession - Loading config from database");

    try {
      const contact = await this.prisma.contacts.findFirst({
        where: {
          phoneNumber: phoneNumber,
          storeId: storeId
        },
      });

      console.info("getContactByNumberAndSession - Configs loaded from database", contact);

      return contact;

    } catch (error) {
      console.error("Error occurred while retrieving contact:", error);
      throw error;
    }finally {
      await this.prisma.$disconnect();
    }
  }

  async createContact(contactData: Contacts): Promise<Contacts> {

    try {
      const contact = await this.prisma.contacts.create({
        data: {
          name: contactData.name,
          phoneNumber: contactData.phoneNumber,
          sessionId: contactData.sessionId,
          storeId: contactData.storeId
        },
      });

      return contact;
    } catch (error) {
      console.error("Error occurred while seeding contact:", error);
      throw error;
    }finally {
      await this.prisma.$disconnect();
    }
  }

  async updateContact(id:number,name:string):Promise<Contacts>{
    try{
      const contact = await this.prisma.contacts.update({
        where:{id:id},
        data:{
          name:name,
        }
      })
      return contact
    }catch(error){
      console.error("Error occurred while updating contact", error);
      throw error;
    }finally {
      await this.prisma.$disconnect();
    }
  }

  async getContactByPhoneNumber(phoneNumber:string):Promise<Contacts>{
    try {const contact = await this.prisma.contacts.findFirst({
      where:{
        phoneNumber:phoneNumber
      }
    })
    return contact!
  }catch(error){
      console.error("Error occurred while getting the contact", error);
      throw error;
    }finally {
      await this.prisma.$disconnect();
    }
  }
}