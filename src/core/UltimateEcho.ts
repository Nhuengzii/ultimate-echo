// sigleton class that manage the core of Ultimate Echo bot

import { Client } from "discord.js";
import { InitializeTextCommandAbility } from "./TextCommands/TextCommandHandlers"

export class UltimateEcho {
  client: Client;
  isInitReay: boolean = false;
  static instance: UltimateEcho;



  constructor(client: Client) {
    this.client = client
    InitializeTextCommandAbility(this.client);






    this.isInitReay = true
  }

  static getInstance(client: Client) {
    if (!UltimateEcho.instance) {
      UltimateEcho.instance = new UltimateEcho(client);
    }
    return UltimateEcho.instance;
  }


}


