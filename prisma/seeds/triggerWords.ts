import {TriggerWords, PrismaClient} from "@prisma/client"

export const triggerWordsData : TriggerWords[]=
    [
        <any>
          {
            id: 1,
            message: "Oi",
            type: "saudação"
          },
          {
            id: 2,
            message: "Olá",
            type: "saudação"
          },
          {
            id: 3,
            message: "Bom dia",
            type: "saudação"
          },
          {
            id: 4,
            message: "Boa tarde",
            type: "saudação"
          },
          {
            id: 5,
            message: "Boa noite",
            type: "saudação"
          },
          {
            id: 6,
            message: "E aí?",
            type: "saudação"
          },
          {
            id: 7,
            message: "Tudo bem?",
            type: "saudação"
          },
          {
            id: 8,
            message: "Como vai?",
            type: "saudação"
          },
          {
            id: 9,
            message: "Oi, tudo certo?",
            type: "saudação"
          },
          {
            id: 10,
            message: "E aí, beleza?",
            type: "saudação"
          },
          {
            id: 11,
            message: "Oi, tudo bem contigo?",
            type: "saudação"
          },
          {
            id: 12,
            message: "Oi, tudo tranquilo?",
            type: "saudação"
          },
          {
            id: 13,
            message: "Opa, beleza?",
            type: "saudação"
          },
          {
            id: 14,
            message: "Salve",
            type: "saudação"
          },
          {
            id: 15,
            message: "E aew, tudo certo?",
            type: "saudação"
          },
          {
            id: 16,
            message: "Oi, tudo joia?",
            type: "saudação"
          },
          {
            id: 17,
            message: "E aí, firmeza?",
            type: "saudação"
          },
          {
            id: 18,
            message: "Oi, tudo em paz?",
            type: "saudação"
          },
          {
            id: 19,
            message: "Oi, tudo de bom?",
            type: "saudação"
          },
          {
            id: 20,
            message: "Oi, como estão as coisas?",
            type: "saudação"
          }
        ];
        
    


    export async function seedTriggerWords(prisma: PrismaClient, triggerWordsData: TriggerWords[]) {
        for (const {id, message, type } of triggerWordsData) {
          await prisma.triggerWords.upsert({
            where: {
              id,
            },
            update: {
              message,
            },
            create: {
              message,
              type
            }
          });
        }
        await prisma.triggerWords.deleteMany({
          where: {
            message: { notIn: triggerWordsData.map(data => data.message) }
          }
        });
      }
      