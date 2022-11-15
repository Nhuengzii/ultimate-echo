import { getVoiceConnection, VoiceConnectionState } from "@discordjs/voice"
import { GuildMember, VoiceBasedChannel } from "discord.js"
import { UltimateEcho } from "../UltimateEcho"

// discconnect all people from voice channels
export async function disconnectAll(channel: VoiceBasedChannel) {
  const fetchChannel = await channel?.fetch(true)
  const members = fetchChannel.members
  const echo = UltimateEcho.getInstance(undefined)

  // disconnect all members
  members.forEach(member => {
    if (member.voice) {
      if (member.id != echo.client.user.id) {
        member.voice.disconnect()
      }
    }
  }, this);
}
