import { GuildMember, VoiceBasedChannel } from "discord.js";

export interface VoiceMessage {
  member: GuildMember;
  content: string;
  voiceChannel: VoiceBasedChannel;
}



