# Prisma
Sistema ORM que vai fazer a abstração do nosso banco de dados do Postgres para o nosso código em TypeScript. A documentação oficial pode ser encontrada [aqui](https://www.prisma.io/).

## Prisma Schema
O `Schema` é o ponto de configuração principal do ORM e fica alocado em `/prisma/schema.prisma`. É nele que passamos os dados de conexão, as representações das tabelas/entidades e também as definições dos geradores. É de extrema importância ter o máximo de cuidado com o _schema_, uma vez que é o elo de ligação entre o banco e o código. Portanto, caso seja necessário fazer alguma alteração na estrutura da base de dados, deve ser feita a princípio aqui no _schema_, e depois refleti-las no banco e código. Para tornar dessas modificações efetivas no banco de dados, é utilizado o conceito de [Prisma Migrate](#prisma-migrate) explicado mais abaixo. Já para refletir nas propriedades acessíveis no código, é utilizado o conceito do [Prisma Client](prisma-client). 

Informações de como criar ou alterar os modelos no _schema_ são encontrados [aqui](https://www.prisma.io/docs/concepts/components/prisma-schema).

<!-- Verificar o generator do dbml -->

## Prisma Client
É uma classe fornecida pelo prisma, que ao instanciar, gera um objeto contendo todos os modelos especificados no _schema_ e os métodos de queries como _findUnique, create, update_. Essa classe baseia a sua tipagem em um _schema_ localizado em `node_modules/.prisma/client/schema.prisma`, sendo este montado a partir de um **Prisma Schema** que contenha o gerador _prisma-client-js_. Como descrito anteriormente, qualquer alteração na estrutura do banco deve ser realizada no **Prisma Schema**, porém para que essas alterações sejam refletidas no **Prisma Client** é possível fazer de duas formas, sendo uma delas, rodar a **Migration** referente à essa mudança, ou manualmente executar o comando abaixo.

```bash
npx prisma generate
```

Essas duas formas irão fazer com que o **Prisma Client** se atualize para refletir as entidades modeladas no **Prisma Schema**.

Informações sobre o processo de criação/atualização do client, assim como a realização de queries para o banco de dados, podem ser encontradas [aqui](https://www.prisma.io/docs/concepts/components/prisma-client).


## Prisma Migrate
Sistema de geração de código SQL que é executado contra o banco de dados criando alteração estruturais - execução de DDLs. Dessa forma, ao ser feito uma alteração no **Prisma Schema** que altere a estrutura do banco de dados, uma _migration_ deve ser gerada, onde é possível identificar um comando `SQL` que será executado no banco. Essas _migrations_ serão mantidas por toda a história do projeto e portanto utilizam do `GIT` para gerenciar um versionamento. Também nesse escopo, no banco de dados é criado uma tabela que armazena quais das _migrations_ criadas já foram rodadas naquele banco, e portanto não ser executadas novamente. É **importante** ressaltar que as _migrations_ não devem ser alteradas e nem excluídas, pois são o histórico do banco, e caso, em algum momento, seja necessário replicar a estrutura do banco, bastaria apenas rodar as _migrations_.

Está não é uma ferramenta que deve ser utilizada para incluir/alterar registros em tabelas no banco. Caso seja esse o interesse, verificar a possibilidade de utilizar o sistema de [Seed](#seed).

### Introspection
Como dito anteriormente, toda modificação deve seguir o caminho de _schema_ → _migration_ → banco. Mas e se for um projeto em andamento? E se já tiver alguma coisa no banco?
Para isso existe o processo de **Introspection** que cria um primeiro _schema_ a partir da estrutura pré-existentes no banco de dados (ao contrário de um procedimento usual).
A funcionalidade é executada através do seguinte comando: 

```bash
npx prisma db pull
```

Com esse comando, o Prisma irá se conectar ao banco de dados, ler as tabelas e criar um _schema_ correspondente. Algumas alterações manuais podem ser necessárias a fim de corrigir ou mapear formatos de nomes de colunas e variáveis.

Após isso, para futuras mudanças, devemos seguir o procedimento padrão onde tais modificações ser criadas no _schema_, que por sua vez criará uma _migration_ correspondente que deverá ser executada para realizar a atualização do banco e o versionamento da mesma.


#### Migration Inicial
Se as _migrations_ servem para manter o histórico de alterações do banco é de suma importância que se tenha uma migration que corresponda ao estado inicial desse banco nos casos em que o sistema de **Introspection** foi utilizado. Para isso, após fazer as correções manuais do _schema_ gerado, basta utilizar o seguinte comando:

```bash
npx prisma migrate dev --name initial-migration --create-only
```

Esse comando vai gerar uma _migration_ contendo um SQL que vai representar todo o _schema_ e consequentemente a estrutura do banco de dados no estado atual. A flag `--name` configura o nome da _migration_ e a flag `--create-only` faz com que a _migration_ seja criada mas não executada.

#### Ignorando a Migration Inicial
Para que essa _migration_ que representa o seu banco em estado atual não seja executada, uma vez que o banco já apresenta aquela estrutura, e assim não sobrescreva os dados já existentes, é preciso executar o seguinte comando:

```bash
npx prisma migrate resolve --applied nome_da_pasta_que_armazena_a_migration_inicial
```

Com isso essa _migration_ vai ser inserida na tabela de migrations executas, porém sem ser executada de fato contra o banco de dados

### Nova migration / Alterações no schema
Caso seja necessário fazer alguma alteração estrutural do banco de dados, é preciso fazer a alteração no _schema_ e então gerar uma _migration_ para essa alteração. O prisma ira comparar o estado atual do banco, com o do _schema_, encontrar as diferenças, e gerar uma _migration_ que quando executada sincronize ambos. Para isso basta fazer a alteração no arquivo `/prisma/schema.prisma` e então rodar o comando:

```bash
npx prisma migrate dev --name added_job_title
```

Esse comando irá criar uma nova migrations dentro da pasta `/prisma/migrations` e irá rodar o seu conteúdo contra o banco de dados

### Gerar Migration sem executar
Alguns recursos utilizados em banco de dados não são representados no conceito de _schema_ do Prisma, tais como _stored procedures, triggers, views, partial index, etc._ porém ainda é possível criá-los pelos sistema de _migrations_ (altamente recomendado para poder se ter um histórico de formação do banco de dados).

Para isso basta executar o comando:

```bash
npx prisma migrate --name migration-name --create-only
```

Vai ser criado uma nova migration na pasta `/prisma/migrations` onde você pode incluir os seus recursos, por exemplo:

```sql
CREATE UNIQUE INDEX tests_success_constraint ON posts (subject, target)
WHERE success;
```

Para aplicá-la, basta você vai executar essa _migration_ utilizando o comando normal

```bash
npx prisma migrate dev
```

### Considerações sobre Migrations
<b style="color:#FF0000">NUNCA ALTERE UMA MIGRATION QUE JÁ FOI EXECUTADA.</b> Caso você perceba que cometeu um erro na sua migration, é preciso entender o ambiente em que esse erro foi identificado (desenvolvimento ou produção) e corrigir de acordo, mas em nenhuma hipótese a _migration_ executada deve ser alterada.

Caso você tenha alterado o _schema.prisma_ e queria verificar o SQL antes de rodar a migration, basta seguir esse procedimento de [gerar uma migration sem executar](#gerar-migration-sem-executar)

O conceito de Migrations é para manter um versionamento do banco de dados, e não para desenvolvimento/prototipação. Para prototipação de novas estruturas de banco de dados, consultar essa [documentação](https://www.prisma.io/docs/guides/database/prototyping-schema-db-push)

<u>Em um ambiente de desenvolvimento</u>, seja ele considerando um banco de dados local (Docker), ou nuvem (importante que esse banco não contenha dados utilizados em produção), pode acontecer de o _schema_ do Prisma e do banco entrem em conflito devido a alterações e/ou procedimentos realizados de forma inadequada. Nessas situações o Prisma recomenda que todo banco de dados seja reiniciado e que todas as migrations sejam executadas novamente. (Oh shit :scream: What about my data?)

Documentação detalhada do [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## Seed
Sistema que insere dados programados no banco de dados a fim de preencher as tabelas para que se tenha algum insumo para testes e outras coisas. É uma ferramenta para ser utilizada exclusivamente para o ambiente de desenvolvimento.

As alterações devem ser executas pelo arquivo `/prisma/seed.ts` colocando os dados que devem ser inseridos. Para executar a funcionalidade basta rodar o comando

```bash
npx prisma db seed
```

O sistema de seed roda automaticamente nas seguintes situações:

- Ao rodar o comando `npx prima migrate reset` (<b style="color:#FF0000">NUNCA USE ESSE COMANDO EM AMBIENTE DE PRODUÇÃO</b> viu Laura Genari, estagiária sênior)
- Ao rodar o comando `npx prisma migrate dev` e este comando interativamente resetar o banco de dados - acontece quando há uma diferença, ou conflito entre banco de dados e o histórico de migrations
  
_OBS: Para evitar este comportamento automático, basta rodar os comandos acima juntamente com a opção `--skip-seed`_

Documentação detalhada do [Prisma Seed](https://www.prisma.io/docs/guides/database/seed-database)