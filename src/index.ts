import { Client, Events, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"


const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent]
})



// log client tag when client is ready
client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})


// get token from .env file
dotenv.config()
const TOKEN = process.env.TOKEN


client.login(TOKEN);
