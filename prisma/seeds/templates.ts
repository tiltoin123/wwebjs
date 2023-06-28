import {Templates,PrismaClient} from "@prisma/client"

export const templateData: Templates[]=[
    <any>{ id: 1, message: "Olá, a Imobiliária agradece o contato envie a opção desejada para prosseguirmos com o seu atendimento\n"+
    "1- Comprar imóveis tratar com Gabriela\n"+
    "2- Vender imóveis tratar com Gabriela\n"+
    "3- Setor de finanças, (atraso, antecipação ou extravio de boletos) tratar com Débora\n"+
    "4- Setor jurídico e renegociação tratar com Ângela\n"+
    "5- O que vem por aí, Novos empreendimentos Tio Fábio.", lastMessage:0, storeId:2 },
    { id: 2, message: "Que tipo de imóvel deseja comprar?\n"+
    "1- Casa\n"+
    "2- Apartamento\n"+
    "3- Barracão\n"+
    "4- Terreno\n"+
    "5- Chácara\n"+
    "6- Rancho\n"+
    "7- Área", lastMessage: 1,condition:"1 um primeiro comprar compra",  storeId:2 },
    { id: 3, message: "Entendi. Por favor envie alguns dados do imóvel em questão,\n"+
    "1- Chácara\n"+
    "2- Apartamento\n"+
    "3- Terreno\n"+
    "4- Casa\n"
    , lastMessage:1, condition:"2 dois segunda vender venda vende", nextMessage:4, storeId:2},
    { id: 4, message: "Qual a metragem do imóvel?",lastMessage:3, condition:"1 um primeira chácara chacara 3 terceira tres três terreno", nextMessage:6,storeId:2},
    { id: 5, message: "Qual a área construída do imóvel?", lastMessage: 3, condition: "2 ap apartamento segunda dois casa 4 quatro quarta", storeId:2},
    { id: 6, message: "Qual a localização do imóvel?", lastMessage: 5, storeId:2 },
    { id: 7, message: "O imóvel em questão está regularizado?", lastMessage:6, storeId:2 },
    { id: 8, message: "Ok, por favor me envie os seguintes dados para prosseguir o atendimento.\n"+
    "Qual seu nome completo?", condition:"financeiro finanças financas debora débora atraso antecipação antecipacao boleto", lastMessage: 7,storeId:2 },
    { id: 9, message: "Qual o loteamento do imóvel?", lastMessage: 8,  storeId:2 },
    { id: 10, message: "Qual a quadra e o lote do imóvel em questão?", lastMessage: 9, storeId:2 },
    { id: 11, message: "Qual a assunto deseja tratar com o financeiro(boletos perdidos ou atrasados, antecipação de parcelas, reimpressão?", lastMessage: 10, storeId:2 },
    { id: 12, message: "Então você quer tratar de renegociação, por favor me forneça alguns dados.\n"+
    "Qual o loteamento do imóvel?", lastMessage:11, storeId:2},
    { id: 13, message: "Qual o nome do empreendimento?", lastMessage: 12, storeId:2 },
    { id: 14, message: "Este imóvel já está sendo renegociado?", lastMessage: 13, storeId:2 },
    { id: 15, message: "Cessão de direito", lastMessage: 14, storeId:2 },
    { id: 16, message: "Qual o nome do empreendimento?", lastMessage: 15, storeId:2 },
];

export async function seedTemplate(prisma:PrismaClient, templateData:Templates[]) {
    for (const {id, message, lastMessage, condition,nextMessage, storeId} of templateData){

        

        await prisma.templates.upsert({
            where:{
                id,
            },
            update:{
                message,
                lastMessage,
                condition,
                nextMessage
            },
            create:{
                id,
                message,
                lastMessage,
                condition,
                nextMessage,
                storeId
            },
        })
    }
    await prisma.templates.deleteMany({
    where: {
      id: { notIn: templateData.map(data => data.id) }
    }
  });
}