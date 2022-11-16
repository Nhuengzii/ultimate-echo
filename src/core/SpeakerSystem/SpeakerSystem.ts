import { VoiceConnection, AudioPlayer, AudioResource, createAudioPlayer, AudioPlayerStatus, AudioPlayerState } from "@discordjs/voice"
import { UltimateEcho } from "../UltimateEcho"
import { Client } from "discord.js"
import { TextToSpeech } from "../TextToSpeech/TTS";
import { PriorityQueue, PriorityQueueNode } from "../../utils/priorityQueue"
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
  queue: PriorityQueue
  play(playable: IPlayable): void
  isPlaying: boolean
  speakMessage(content: string, lang: string): void
  textToSpeech: TextToSpeech;
}

export class GuildSpeaker implements IGuildSpeaker {
  constructor(guildId: string, connection: VoiceConnection) {
    this.guildId = guildId
    this.connection = connection
    let player = createAudioPlayer()
    connection.subscribe(player)
    this.player = player
    this.queue = new PriorityQueue()
    this.normalResource = null
    this.echo = UltimateEcho.getInstance(undefined);
    this.textToSpeech = new TextToSpeech();
  }
  speakMessage(content: string, lang: string): void {
    let playable = new Playable(0, this.textToSpeech.getAudioResource(content, lang))
    this.play(playable)
  }
  guildId: string
  queue: PriorityQueue
  textToSpeech: TextToSpeech;
  isPlaying: boolean = false
  connection: VoiceConnection
  player: AudioPlayer
  normalResource: AudioResource<unknown>
  echo: UltimateEcho
  play(playable: IPlayable): void {

    if (!this.isPlaying) {
      this.player.play(playable.getAudioResource())
      this.isPlaying = true
      this.player.on(AudioPlayerStatus.Idle, () => {
        this.isPlaying = false
        if (this.queue.isEmpty()) {
        }
        else {
          let DeqPlayable = this.queue.dequeue()
          this.play(DeqPlayable.value)
        }
      })
    }
    else {
      if (playable.priority == 0) {
        this.player.pause()
        let newPlayer = createAudioPlayer()
        this.connection.subscribe(newPlayer)
        newPlayer.play(playable.getAudioResource())
        newPlayer.on(AudioPlayerStatus.Idle, () => {
          this.connection.subscribe(this.player)
          this.player.unpause()
        })
        return;
      }

      this.queue.enqueue(playable.priority, playable)
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
