import { AudioResource, createAudioResource } from "@discordjs/voice";
import { GuildMember, VoiceChannel } from "discord.js";
import { Playable } from "../SpeakerSystem/SpeakerSystem"
import playdl from "play-dl"
import { UltimateEcho } from "../UltimateEcho"

interface IMusicSystem {
  guildId: string;
  voiceConnection: string;
  voiceChannel: VoiceChannel;
  Queue: IMusic[]
  addQueue(music: IMusic): void;
  play(): Promise<void>;
  pause(): void;
  resume(): void;
  stop(): void;
  skip(): void;
  search(query: string): Promise<IMusic>;
}

interface IMusic {
  title: string;
  url: string;
  requester: GuildMember
  getAudioResource(): Promise<AudioResource>;
}


export class Music implements IMusic {
  title: string;
  url: string;
  requester: GuildMember;
  async getAudioResource() {
    const stream = await playdl.stream(this.url);
    let audioResource = createAudioResource(stream.stream, {
      inputType: stream.type,
    });
    return audioResource;
  }
  constructor(title: string, url: string, requester: GuildMember) {
    this.title = title;
    this.url = url;
    this.requester = requester;
  }
}

export class MusicSystem implements IMusicSystem {
  guildId: string;
  voiceConnection: string;
  voiceChannel: VoiceChannel;
  Queue: IMusic[];
  echo: UltimateEcho;
  constructor(guildId: string) {
    this.Queue = [];
    this.guildId = guildId;
    this.echo = UltimateEcho.getInstance(undefined);
  }
  async search(query: string): Promise<IMusic> {
    let result = await playdl.search(query, { limit: 1, source: { youtube: "video" } });
    let music = new Music(result[0].title, result[0].url, null);
    return music;
  }
  addQueue(music: IMusic): void {
    this.echo.speakerSystem.getGuildSpeaker(this.guildId).speakMessage("เพิ่มเพลง " + music.title + " ลงในคิวแล้ว", "th");
    this.Queue.push(music);
  }
  async play(): Promise<void> {
    if (this.Queue.length == 0) {
      return
    }
    let music = this.Queue[0]
    let audioResource = await music.getAudioResource()
    let playable = new Playable(1, audioResource);
    let speaker = this.echo.speakerSystem.getGuildSpeaker(this.guildId);
    this.Queue.shift();
    speaker.play(playable);
  }
  pause(): void {
    throw new Error("Method not implemented.");
  }
  resume(): void {
    throw new Error("Method not implemented.");
  }
  stop(): void {
    throw new Error("Method not implemented.");
  }
  skip(): void {
    throw new Error("Method not implemented.");
  }
}
