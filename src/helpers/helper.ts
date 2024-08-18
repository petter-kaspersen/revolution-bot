import { Client } from "discord.js";

export class Helper {
  public bot: Client;
  constructor(bot: Client) {
    this.bot = bot;

    bot.on("ready", this.init.bind(this));
  }

  async init() {}
}