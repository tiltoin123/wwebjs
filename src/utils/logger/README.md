## Log System

### Winston

O sistema de logs foi implementado utilizando a biblioteca [winston](https://www.npmjs.com/package/winston) (v3.8.2). Esta ferramenta é uma das mais utilizadas dentro do universo do JavaScript sendo bastante fácil encontrar informações de como utilizá-la da melhor forma.

Esse sistema de logs veio para ser utilizado durante o desenvolvimento a fim de colher informações importantes que podem ajudar em um processo de auditoria, assim como em um _troubleshooting_ do código. Portanto, ao subir alguma implementação nova, deve-se substituir a utilização do objeto global `console` pela ferramenta, a qual atende da mesma forma, trazendo inclusive outros benefícios.

#### Níveis de Log
O nível do log representa a criticidade daquela informação. É representada através de um `enum` contendo o nome e um valor inteiro iniciando em 0, onde o nível mais critico é o 0 e o valor aumenta conforme a criticidade diminui.

Para esse projeto, a ferramenta foi configurada usando os níveis de log padrão mostrados a seguir:
- error: 0
- warn: 1
- info: 2
- http: 3
- verbose: 4
- debug: 5
- silly: 6

#### Transportadores
Os transportadores são os locais onde esse log vai ser impresso, podendo ser no `Console`, um `Arquivo` ou um lugar customizado, sendo que para cada transportador criado é possível configurar o nível de criticidade mínima e o formato do log, os quais podem ser alterados conforme o ambiente em que a solução esteja rodando.

Para este projeto foram configurados 3 transportadores sendo eles:
- **Console**: que vai mostrar a informação com a criticidade mínima de **silly** para `NODE_ENV` sendo _local_, **debug** para `NODE_ENV` sendo _development_ e **http** para as demais possibilidades de `NODE_ENV`.
- **Arquivo**:
  - logs/errors.log: vai conter todos os logs com a criticidade mínima de **error** que por ser a mais baixa será a única criticidade impressa. Ou seja, esse aquivo conterá apenas os logs de erros da aplicação.
  - logs/all.log: vai conter uma cópia de todos os logs que também foram impressos no `Console` dessa forma todos os logs serão armazenados em um arquivo, podendo ser coletados por uma ferramenta coletora de logs.

#### Formato
O log gerado tem uma alta maleabilidade quanto a sua formatação, sendo possível alterar o estilo da mensagem dependendo do ambiente, ou inclusive do transportador para o qual ele será enviado.

Para esse projeto foi considerado o seguinte padrão ` timestamp | [LEVEL] -> message { ...metadata }` independente do transportador utilizado, podendo variar apenas a coloração utilizada na parte que contém o `LEVEL`.

```log
 2022-10-14 14:19:37 | [INFO] -> Axios instance has been set | metadata: {
  "baseURL": "https://api.etadirect.com/rest/ofscCore/v1"
}
```

#### Utilização durante desenvolvimento
Para utilizar a ferramenta, basta importar a instância (_importação default_) no local necessário e executar a função `log` passando como parâmetro o objeto que contenha as propriedades **level**, **message** e um objeto **metadata (opcional)** que contenha qualquer informação a mais que se deseje logar.

```typescript
import logger from "@utils/logger";
...
...
logger.log({
  level: "info",
  message: "Hello!",
  metadata: {
    route: "/hello-word",
    ip: "127.0.0.1",
    ...
  }
})

logger.log({
  level: "error",
  message: "Boom!",
  metadata: {
    name: error.name,
    stack: error.stack,
    ...
  }
})
```
Também é possível utilizar a instância utilizando o método com o mesmo nome do nível uma vez que os níveis utilizados não foram alterados, portanto o exemplo acima poderia ser reproduzido da seguinte forma:

```typescript
import logger from "@utils/logger";
...
...
logger.info("Hello!", {
  route: "/hello-word",
  ip: "127.0.0.1",
  ...
})

logger.error("Boom!", {
  name: error.name,
  stack: error.stack,
  ...
})
```

### Morgan
Por se tratar de um serviço back-end utilizando o ExpressJs, foi possível utilizar de um serviço de log que se utiliza do padrão de middleware da API a fim de logar as informações de qualquer rota acessada de forma automática. Para isso, estamos utilizando a biblioteca [Morgan](https://www.npmjs.com/package/morgan) (v1.10.0).

#### Stream
Nessa biblioteca é possível fazer uma configuração de stream utilizado para escrever os logs, e uma vez que nós já temos a ferramenta do `winston` configurada com um nível **http** nós passamos esse método do winston como stream a ser utilizado pelo `morgan`. Assim todos os logs gerados pelo `morgan` serão impressos através do `winston` utilizando os seus transportadores.

#### Formatação
A formatação de uma mensagem do `morgan` vai seguir o mesmo padrão do utilizado pelo `winston` uma vez que utilizada dele como stream, porém por se tratar de um middleware, com as mensagens sendo montadas de forma automático é possível prever o padrão da mensagem quanto às informações de **LEVEL**, **mensagem** e **metadata**. Abaixo segue o padrão configurado.

```log
2022-10-14 17:19:48 | [HTTP] -> Request | metadata: {
  "method": "GET",
  "url": "/api/resources/T3668010/activities?dateFrom=2022-09-10&dateTo=2022-09-09",
  "response": "3.173 ms",
  "status": "400"
}
```

As informações de **level** e **mensagem** serão sempre as mesmas (HTTP e Request respectivamente), já no objeto de **metadata**, sempre teremos as propriedades _method_, _url_, _response-time_ e _status_
