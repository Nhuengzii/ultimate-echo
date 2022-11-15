import { AudioResource } from "@discordjs/voice";

export interface ITTS {
  getAudioResource(text: string, lang: string): AudioResource;
}

import { ViaGtts } from "./ViaGtts"


export class TextToSpeech {
  tts: ITTS;
  constructor() {
    this.tts = new ViaGtts();
  }
  getAudioResource(text: string, lang = "th"): AudioResource {
    return this.tts.getAudioResource(text, lang);
  }
}
