import { PrismaClient, Stores } from "@prisma/client";

export interface IStoresRepository {
  getStoreByPhoneNumber(phoneNumber: string): Promise<Stores>;
}

export class PrismaStoresRepository implements IStoresRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getStoreByPhoneNumber(phoneNumber: string): Promise<Stores> {

    console.debug("Get Store By PhoneNumber");

    try {
      const contact = await this.prisma.stores.findFirstOrThrow({
        where: {
          phone: phoneNumber,
        },
      });

      console.info("Get All - Configs loaded from database", contact);

      return contact;
    } catch (error) {
      console.error("Error occurred while retrieving contact:", error);
      throw error;
    }finally {
      await this.prisma.$disconnect();
    }
  }

}