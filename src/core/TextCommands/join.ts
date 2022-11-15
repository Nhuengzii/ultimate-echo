import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { Guild } from "discord.js";
import { UltimateEcho } from "../UltimateEcho"
import { TextToSpeech } from "../TextToSpeech/TTS"
import { Playable } from "../SpeakerSystem/SpeakerSystem"
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

  const echo = UltimateEcho.getInstance(undefined);
  echo.speakerSystem.addGuildSpeaker(guild.id, connection);
  let tts = new TextToSpeech();
  let playable = new Playable(0, tts.getAudioResource("สวัสดีค่ะ", "th"))
  echo.speakerSystem.speak(guild.id, playable);
  console.log("Joined voice channel");
}
