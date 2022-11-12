import { Client, Message, Events } from "discord.js"


import { join } from "./join"


export function InitializeTextCommandAbility(client: Client) {
  client.on(Events.MessageCreate, (message: Message) => {
    let content = message.content
    let command = content.split(" ")[1]
    if (!content || !content.startsWith("echo")) {
      return;
    }

    switch (command) {
      case "ping":
        message.reply("pong")
        break;
      case "join":
        if (!message.member?.voice.channel) {
          return;
        }
        if (!message.guild) {
          return;
        }
        join(message.guild, message.member.voice.channel.id);
        break;

      default:
        console.log("command not found")
        break;
    }
  })
}
