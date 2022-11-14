import { VoiceMessage } from "./VoiceCommands/VoiceMessage"
import { UltimateEcho } from "./UltimateEcho"


// Voice Command
import { leave } from "./VoiceCommands/leave"


export interface VoiceCommandState {
  name: string;
  enter(): void;
  exit(): void;
  execute(voiceMessage: VoiceMessage): Promise<void>;
  echo: UltimateEcho;
  changeState(newState: VoiceCommandState): void
}

const echoAliases = ["เอคโค่", "echo", "เอโค่", "อีโค่", "Eco", "eco", ""]

export class WaitingForActivationState implements VoiceCommandState {
  name: string = "WaitingForActivationState";
  async execute(voiceMessage: VoiceMessage): Promise<void> {
    if (echoAliases.includes(voiceMessage.content)) {
      console.log(`${voiceMessage.member.user.tag} activated echo`);
      this.echo.currentTargetUserId = voiceMessage.member.user.id;
      this.changeState(new WaitingForCommandState());
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
        return;
    }
  }
  constructor() {
    this.echo = UltimateEcho.getInstance(undefined);
  }
  echo: UltimateEcho
  enter(): void {
    console.log("entering WaitingForCommandState");
  }
  exit(): void {
    console.log("exiting WaitingForCommandState");
  }
  changeState(newState: VoiceCommandState): void {
    this.exit();
    newState.enter();
    this.echo.voiceCommandState = newState;
  }
}
