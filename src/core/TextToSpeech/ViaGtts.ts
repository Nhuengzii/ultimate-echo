import { AudioResource, createAudioResource } from "@discordjs/voice"
import { ITTS } from "./TTS"
const gTTS = require("gtts")

export class ViaGtts implements ITTS {
  constructor() {

  }
  getAudioResource(text: string, lang: string): AudioResource {
    let tts = new gTTS(text, lang)
    tts = createAudioResource(tts.stream(), {
      inputType: tts.type
    })
    return tts
  }
}
