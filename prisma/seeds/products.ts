import { Products,PrismaClient } from "@prisma/client";

const prisma = new PrismaClient;

export const productData: Products[] =
  [
    <any>{
      url:"https://imoveisfranca.com.br/imovel/id/182092",
      name: "Apartamento - residencial - Parque Mundo Novo - Franca",
      number: "2467",
      complement: "r. Antoniel Alves Rodrigues, próximo ao SPA do bronze",
      neighborhood: "Parque Mundo Novo",
      city: "franca",
      state: "SP",
      country: "Brasil",
      value:85000,
      productType:"apartamento",
      storeId:1,
      createdUser:"admin",
      updatedUser:"admin"
    },
    <any>{
        url:"https://imoveisfranca.com.br/imovel/id/190787",
        name: "Apartamento - residencial - Jardim Santana - Franca",
        number: "1709",
        complement: "r. Taufik Saloum, atrás do tonin",
        neighborhood: "Jardim Santana",
        city: "franca",
        state: "SP",
        country: "Brasil",
        value:90000,
        productType:"apartamento",
        storeId:1,
        createdUser:"admin",
        updatedUser:"admin"
      }
  ];

  export async function seedProducts(prisma:PrismaClient, productData:Products[]) {
    for (const{ url, name, number, complement, neighborhood, city, state, country, value, productType, storeId, createdUser, updatedUser} of productData){
        await prisma.products.upsert({
            where:{
                url,
            },
            update:{
                name,
                number,
                complement,
                neighborhood,
                city,
                state,
                country,
                value,
                productType           
               },
               create:{
                url,
                name,
                number,
                complement,
                neighborhood,
                city,
                state,
                country,
                value,
                productType,
                storeId,
                createdUser,
                updatedUser           
               },
        })
    }
    await prisma.products.deleteMany({
      where: {
        name: { notIn: productData.map(data => data.name) }
      }
    });
  }

