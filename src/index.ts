import { Client, Events, GatewayIntentBits } from "discord.js"
import * as dotenv from "dotenv"
import { UltimateEcho } from "./core/UltimateEcho"
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


// Install Ultimate Echo utility to client

const ultimateEcho = UltimateEcho.getInstance(client)
ultimateEcho.setUpAbility()
// log install status
if (ultimateEcho.isInitReay) {
  console.log("Ultimate Echo is ready to use")
} else {
  console.log("Ultimate Echo is not ready to use")
}


// get token from .env file
dotenv.config()
const TOKEN = process.env.TOKEN

client.login(TOKEN);
