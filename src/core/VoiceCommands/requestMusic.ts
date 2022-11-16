import { VoiceMessage } from "./VoiceMessage"
import { MusicSystem, Music } from "../MusicSystem/MusicSystem"
import { UltimateEcho } from "../UltimateEcho"


export async function requestMusic(voiceMessage: VoiceMessage) {
  let query = voiceMessage.content.split("เปิดเพลง")[1];
  const echo: UltimateEcho = UltimateEcho.getInstance(undefined);
  let musicSystem = echo.musicSystem[voiceMessage.member.guild.id];
  let music = await musicSystem.search(query);
  musicSystem.addQueue(music);
}
