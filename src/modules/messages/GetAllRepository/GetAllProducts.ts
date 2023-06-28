import { Products,PrismaClient } from "@prisma/client";

export interface IProductsRepository{
    getProductsByUrl(ProductUrl:string):Promise<Products>
}

export class PrismaProductsRepository implements IProductsRepository{
    private prisma: PrismaClient;

    constructor(){
        this.prisma = new PrismaClient();
    }

    async getProductsByUrl(ProductUrl: string): Promise<Products> {
        console.debug("Fetching products by url",ProductUrl)

        try{
            const urlProduct = await this.prisma.products.findUnique({
                where:{url:ProductUrl}
            })
            return urlProduct!;
        }catch(error){
            console.error("Error fetching product by url", error)
            throw error
        }finally {
            await this.prisma.$disconnect();
          }
    }
}