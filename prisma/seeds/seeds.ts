import { PrismaClient } from "@prisma/client";
import { seedStore, storeData } from "./stores";
import { seedTemplate,templateData } from "./templates";
import { seedProducts,productData } from "./products";
import { seedTriggerWords,triggerWordsData } from "./triggerWords";
const prisma = new PrismaClient()


async function seedData() {
    
    await seedStore(prisma, storeData)
    await seedTemplate(prisma,templateData)
    await seedProducts(prisma,productData)
    await seedTriggerWords(prisma,triggerWordsData)

}

async function main() {
    try {
      await prisma.$connect();
      await seedData();
    } catch (error) {
      console.error(error);
    } finally {
      await prisma.$disconnect();
    }
  }

  main();