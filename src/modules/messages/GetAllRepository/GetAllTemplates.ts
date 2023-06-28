import {Templates,PrismaClient} from "@prisma/client"
export interface ITemplatesRepository{
    getTemplatesByStoreId(storeId:number):Promise<Templates[]>;
    getTemplatesById(templateId:number):Promise<Templates | null>;
    //getUpdatedTemplateData(templateData:Templates[],chatLead:ChatLead):Templates[];
}

export class PrismaTemplatesRepository implements ITemplatesRepository{
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

    async getTemplatesByStoreId(store: number): Promise<Templates[]> {
        
        console.debug("Fetching templates by storeId", store);
        
        try {
    
          const storeTemplate = await this.prisma.templates.findMany({
            where: { storeId: store},
          });
    
          //console.info("Store templates fetched", storeTemplate);
    
          return storeTemplate;
          
        } catch (error) {
          console.error("Error fetching templates by storeId", error);
          throw error;
        }finally {
          await this.prisma.$disconnect();
        }
      }
      
      /* getUpdatedTemplateData(templateData: Templates[], chatLead: ChatLead): Templates[] {
        templateData.forEach((item) => {
          const regex = /\${(.*?)}/g;
          item.message = item.message.replace(regex, (match, interpolatedValue) => {
            if (interpolatedValue in chatLead) {
              const key = interpolatedValue as keyof ChatLead;
              return chatLead[key];
            }
            return match;
          });
        });
        return templateData;
      } */
      
      
      async getTemplatesById(templateId: number): Promise<Templates | null> {

        try {

          console.debug("Fetching templates by Id", templateId);
    
          const templateMessage = await this.prisma.templates.findUnique({
            where: { id: templateId },
          });
    
          console.info("Template fetched", templateMessage);
    
          return templateMessage;

        } catch (error) {
          console.error("Error fetching template by Id", error);
          throw error;
        }finally {
          await this.prisma.$disconnect();
        }
      }
}