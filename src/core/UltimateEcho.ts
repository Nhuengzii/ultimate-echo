// sigleton class that manage the core of Ultimate Echo bot

import { Client } from "discord.js";
import { InitializeTextCommandAbility } from "./TextCommands/TextCommandHandlers"
import { WaitingForActivationState, VoiceCommandState } from "./VoiceCommandState"
import { attachASR } from "./SpeechRecognition/attachASR"
import { SpeakerSystem, GuildSpeaker, IPlayable, IGuildSpeaker } from "./SpeakerSystem/SpeakerSystem"

export class UltimateEcho {
  client: Client;
  isInitReay: boolean = false;
  private static instance: UltimateEcho;
  voiceCommandState: VoiceCommandState;
  currentTargetUserId: string = "";
  speakerSystem: SpeakerSystem;

  private constructor(client: Client) {
    this.client = client
  }

  setUpAbility() {
    InitializeTextCommandAbility(this.client);
    this.voiceCommandState = new WaitingForActivationState();
    this.voiceCommandState.enter();
    this.speakerSystem = new SpeakerSystem();
    attachASR(this.client);
    this.isInitReay = true

  }

  static getInstance(client: Client) {
    if (!UltimateEcho.instance) {
      UltimateEcho.instance = new UltimateEcho(client);
    }
    return UltimateEcho.instance;
  }

  async executeVoiceCommand(voiceMessage: any) {
    await this.voiceCommandState.execute(voiceMessage);
  }


}


