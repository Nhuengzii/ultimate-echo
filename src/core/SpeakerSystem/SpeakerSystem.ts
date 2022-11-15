import { VoiceConnection, AudioPlayer, AudioResource, createAudioPlayer, AudioPlayerStatus, AudioPlayerState } from "@discordjs/voice"
import { UltimateEcho } from "../UltimateEcho"
import { Client } from "discord.js"
export interface IPlayable {
  priority: number;
  getAudioResource(): AudioResource;
}


export class Playable implements IPlayable {
  priority: number;
  audioResource: AudioResource;
  constructor(priority: number, audioResource: AudioResource) {
    this.priority = priority;
    this.audioResource = audioResource;
  }
  getAudioResource(): AudioResource {
    return this.audioResource;
  }
}

export interface IGuildSpeaker {
  guildId: string
  connection: VoiceConnection | null
  player: AudioPlayer | null
  normalResource: AudioResource | null
  echo: UltimateEcho | null
  play(playable: IPlayable): void
  isPlaying: boolean
}

export class GuildSpeaker implements IGuildSpeaker {
  constructor(guildId: string, connection: VoiceConnection) {
    this.guildId = guildId
    this.connection = connection
    let player = createAudioPlayer()
    connection.subscribe(player)
    this.player = player
    this.normalResource = null
    this.echo = UltimateEcho.getInstance(undefined);
  }
  guildId: string
  isPlaying: boolean = false
  connection: VoiceConnection
  player: AudioPlayer
  normalResource: AudioResource<unknown>
  echo: UltimateEcho
  play(playable: IPlayable): void {
    if (!this.player) {
      this.player.play(playable.getAudioResource())
      this.isPlaying = true
      this.player.on(AudioPlayerStatus.Idle, () => {
        this.isPlaying = false
      })
    }
  }
}


export class SpeakerSystem {
  echo: UltimateEcho | null = null;
  guildSpeakers: Record<string, GuildSpeaker> = {}
  constructor() {
    this.echo = UltimateEcho.getInstance(undefined);
  }

  getGuildSpeaker(guildId: string): GuildSpeaker {
    if (guildId in this.guildSpeakers) {
      return this.guildSpeakers[guildId]
    }
  }

  addGuildSpeaker(guildId: string, connection: VoiceConnection): GuildSpeaker {
    if (guildId in this.guildSpeakers) {
      console.log("GuildSpeaker already exists")
      return
    }

    let guildSpeaker: GuildSpeaker = new GuildSpeaker(guildId, connection)
    this.guildSpeakers[guildId] = guildSpeaker
  }
  removeGuildSpeaker(guildId: string) {
    if (guildId in this.guildSpeakers) {
      delete this.guildSpeakers[guildId]
    }
  }

  speak(guildId: string, playable: IPlayable) {
    let guildSpeaker: GuildSpeaker = this.getGuildSpeaker(guildId)
    if (guildSpeaker) {
      guildSpeaker.player.play(playable.getAudioResource())
    }
  }



}
