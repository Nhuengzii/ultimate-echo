import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { Guild } from "discord.js";

export function join(guild: Guild, voiceChannelId: string) {

  let connection = getVoiceConnection(guild.id)
  if (connection) {
    console.log("Already connected to a voice channel");
    return;
  }

  connection = joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator,
    selfDeaf: false,
  });


  console.log("Joined voice channel");
}
