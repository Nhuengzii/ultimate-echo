import { addSpeechEvent, VoiceMessage } from "discord-speech-recognition"
import { Client } from "discord.js";
import { VoiceMessage as MyVoiceMessage } from "../VoiceCommands/VoiceMessage"
import { UltimateEcho } from "../UltimateEcho";


export function attachASR(client: Client) {
  addSpeechEvent(client, { lang: "th-TH" });
  client.on("speech", async (voiceMessage: VoiceMessage) => {

    if (!voiceMessage.content) {
      return;
    }
    // log who say what
    console.log(`${voiceMessage.member.user.tag} said: ${voiceMessage.content}`);

    let myVoiceMessage: MyVoiceMessage = {
      member: voiceMessage.member,
      content: voiceMessage.content,
      voiceChannel: voiceMessage.member.voice.channel
    }


    UltimateEcho.getInstance(client).executeVoiceCommand(myVoiceMessage);
  })
}
