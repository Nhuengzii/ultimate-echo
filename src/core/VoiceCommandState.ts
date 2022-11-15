import { VoiceMessage } from "./VoiceCommands/VoiceMessage"
import { UltimateEcho } from "./UltimateEcho"
import { TextToSpeech } from "./TextToSpeech/TTS"
import { Playable } from "./SpeakerSystem/SpeakerSystem"


// Voice Command
import { leave } from "./VoiceCommands/leave"
import { disconnectAll } from "./VoiceCommands/disconnectAll"


export interface VoiceCommandState {
  name: string;
  enter(): void;
  exit(): void;
  execute(voiceMessage: VoiceMessage): Promise<void>;
  echo: UltimateEcho;
  changeState(newState: VoiceCommandState): void
}

const echoAliases = ["เอคโค่", "echo", "เอโค่", "อีโค่", "Eco", "eco", "ผู้ช่วย"]

export class WaitingForActivationState implements VoiceCommandState {
  name: string = "WaitingForActivationState";
  async execute(voiceMessage: VoiceMessage): Promise<void> {
    if (echoAliases.includes(voiceMessage.content)) {
      console.log(`${voiceMessage.member.user.tag} activated echo`);
      this.echo.currentTargetUserId = voiceMessage.member.user.id;
      this.changeState(new WaitingForCommandState(voiceMessage));
    }
  }
  constructor() {
    this.echo = UltimateEcho.getInstance(undefined);
  }

  echo: UltimateEcho


  enter(): void {
    console.log("enter WaitingForActivationState");
  }
  exit(): void {
    console.log("exit WaitingForActivationState");
  }
  changeState(newState: VoiceCommandState): void {
    this.exit();
    newState.enter();
    this.echo.voiceCommandState = newState;
  }

}

export class WaitingForCommandState implements VoiceCommandState {
  name: string = "WaitingForCommandState";
  async execute(voiceMessage: VoiceMessage): Promise<void> {
    if (voiceMessage.member.id != this.echo.currentTargetUserId) {
      return;
    }

    let command = voiceMessage.content;
    switch (command) {
      case "ออกไป":
        console.log(`${voiceMessage.member.user.tag} want to use LeaveCommand`)
        leave(voiceMessage.member.voice.channel.guild.id);
        this.changeState(new WaitingForActivationState());
        break
      case "ออกไปให้หมด":
        console.log(`${voiceMessage.member.user.tag} want to use DisconnectAllCommand`)
        disconnectAll(voiceMessage.member.voice.channel);
        this.changeState(new WaitingForActivationState());
        break
    }
  }
  triggerVoiceMessage: VoiceMessage
  constructor(triggerVoiceMessage: VoiceMessage) {
    this.echo = UltimateEcho.getInstance(undefined);
    this.triggerVoiceMessage = triggerVoiceMessage;

  }
  echo: UltimateEcho
  enter(): void {
    console.log("entering WaitingForCommandState");
    let textToSpeech = new TextToSpeech();
    let playable = new Playable(0, textToSpeech.getAudioResource(`ต้องการอะไรคะคุณ ${this.triggerVoiceMessage.member.displayName}`, "th"))
    this.echo.speakerSystem.speak(this.triggerVoiceMessage.member.guild.id, playable);
  }
  exit(): void {
    console.log("exiting WaitingForCommandState");
    let textToSpeech = new TextToSpeech();
    let playable = new Playable(0, textToSpeech.getAudioResource(`จะออกเดี๋ยวนี้ค่ะคุณ ${this.triggerVoiceMessage.member.displayName}`, "th"))
    this.echo.speakerSystem.speak(this.triggerVoiceMessage.member.guild.id, playable);
  }
  changeState(newState: VoiceCommandState): void {
    this.exit();
    newState.enter();
    this.echo.voiceCommandState = newState;
  }
}
