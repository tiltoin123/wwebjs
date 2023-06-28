import { TriggerWords,PrismaClient } from "@prisma/client";

export interface ITriggerWordsRepository{
    getTriggerWordsByType(type:string):Promise<TriggerWords[]>
}

export class PrismaTriggerWordsRepository implements ITriggerWordsRepository{
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async getTriggerWordsByType(type: string): Promise<TriggerWords[]> {
        try {
            const triggerWords = await this.prisma.triggerWords.findMany({
                where:{
                    type:type
                }
            })
            return triggerWords
        } catch (error) {
            console.error("An error occurred while getting the triggerWords", error)
            throw error
        }finally {
            await this.prisma.$disconnect();
          }
    }

}