import { getVoiceConnection } from "@discordjs/voice"



export function leave(guildId: string) {
  const connection = getVoiceConnection(guildId);
  if (connection) {
    connection.destroy();
  }
}

