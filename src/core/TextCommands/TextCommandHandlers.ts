import { Client, Message, Events } from "discord.js"


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
      default:
        console.log("command not found")
        break;
    }
  })
}
