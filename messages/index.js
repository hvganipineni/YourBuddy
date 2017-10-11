/*-----------------------------------------------------------------------------
This template demonstrates how to use an IntentDialog with a LuisRecognizer to add 
natural language support to a bot. 
For a complete walkthrough of creating this type of bot see the article at
https://aka.ms/abs-node-luis
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");
var path = require('path');

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);
bot.localePath(path.join(__dirname, './locale'));

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b768531f-7175-455e-aa81-af81e47692be?subscription-key=66645eb555bb455aa99da5aa0de3eb8d&timezoneOffset=0&verbose=true&spellCheck=true&q=';

// Main dialog with LUIS
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })
/*
.matches('<yourIntent>')... See details at http://docs.botframework.com/builder/node/guides/understanding-natural-language/
*/
//Following is added by Harsha Ganipineni NE230

// This is to capture the intitial reactions of the customer and to guide them into the proper chat.
/*var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send("Greetings! Welcome to the Common Services chatbot. Before we get started please provide your WWID to help you better with your questions. eg (NE230) ");
            },
]);
*/


intents.matches('Supply Chain', [
    function (session, args) {
        var jsonFile = require('../host.json');
        
        var fileName = 'host.json';

var jsonData = jsonFile.readFileSync(fileName);
for (var i = 0; i < jsonData.length; ++i) {
	session.send(jsonData.length);
}
}
    ]);
intents.matches('Architecture', [
    function (session, args) {
    session.send("Whom do you want to talk to in Architecture Group");
   }
    ]);   
intents.matches('Joke', [
    function (session, args) {
    session.send("The Winner of 2017 Technovation is Team Confluence");
   }   
    ]);   
intents.matches('Greetings', [
    function (session, args) {
    //session.send(myObj.text)
     session.send("Greetings! Welcome to the Common Services chatbot-Harsha. Before we get started please provide your WWID to help you better with your questions. eg (NE230) ");
        }
    ]);   
intents.matches('None', [
    function (session, args) {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);
   }
    ]);    
intents.matches('Components', [
    function (session, args) {
    session.send('Maha Sangalli is the Components Enterprise Architect. Do you want to contact him');
   }
    ]);   
intents.matches('Boss', [
    function (session, args) {
    session.send('Jagdheer is the most awesome person in the world');
   }
    ]);    
// </CreateNoteHandler>
/*.onDefault((session) => {
    session.send('Sorry, I did not understand \'%s\'.', session.message.text);*/

bot.dialog('/', intents);    

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}

