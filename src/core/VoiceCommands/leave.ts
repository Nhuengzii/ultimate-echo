import { getVoiceConnection } from "@discordjs/voice"
import { UltimateEcho } from "../UltimateEcho"


export function leave(guildId: string) {
  const connection = getVoiceConnection(guildId);
  if (connection) {
    let echo = UltimateEcho.getInstance(undefined);
    echo.speakerSystem.removeGuildSpeaker(guildId);
    connection.destroy();
  }
}

