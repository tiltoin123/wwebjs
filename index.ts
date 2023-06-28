import { LocalAuth } from "whatsapp-web.js";

const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const fs = require('fs');


// Create the sessions directory if it doesn't exist
if (!fs.existsSync('/sessions')) {
  fs.mkdirSync('/sessions');
}

const client = new Client({
    authStrategy: new LocalAuth({
        clientId:"italo",
        dataPath:'/sessions'
    })
});

client.on('qr', qr => {
    if (!client.isReady) {
      qrcode.generate(qr, { small: true });
    }
  });

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', message => {
	if(message.body == 'Tudo bem! Se precisar de mais alguma coisa, é só me chamar. \n' +
    '\n' +
    'Até a próxima.😀' ){
        client.sendMessage(message.from,"opa to testando um chatbot")
    }
    //console.log(message)
    console.log(message.to)
    console.log(message.from)
});


client.initialize();
