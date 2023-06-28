import { Stores, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const storeData: Stores[] =
  [
    <any><any>{
      name: "ChatRock",
      phone: "551640420556",
      email: "rafael@chatrock.com.br",
      status: "ativo",
      createdUser: "admin",
      updatedUser: "admin",
      id: 1
    },{
      name: "Imobiliária Fábio Liporoni",
      phone: "5516993251297",
      email: "fabioliporoni@imobiliaria.com.br",
      status: "ativo",
      createdUser: "admin",
      updatedUser: "admin",
      id: 2
    },
  ];

export async function seedStore(prisma: PrismaClient, storeData: Stores[]) {
  for (const { name, phone, email, status, createdUser, updatedUser } of storeData) {
    await prisma.stores.upsert({
      where: {
        name,
      },
      update: {
        phone,
      },
      create: {
        name,
        phone,
        email,
        status,
        createdUser,
        updatedUser
      },
    })
  }

  await prisma.stores.deleteMany({
    where: {
      name: { notIn: storeData.map(data => data.name) }
    }
  });
}