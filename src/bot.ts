import "dotenv/config";

import { Client, GatewayIntentBits, Partials } from "discord.js";
import Logger from "./util/logger";
import Command from "./commands/command";
import { CommandTreat } from "./commands/treat";
import { CommandRevolution } from "./commands/revolution";
import { CommandPet } from "./commands/pet";

class Bot {
  private client: Client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  });

  private commands: Command[] = this.registerCommands();
  constructor() {
    this.addListeners();
  }

  addListeners() {
    this.client.on("ready", () => {
      Logger.Info("Bot online");
    });
  }

  addHelpers() {}

  registerCommands() {
    return [new CommandTreat(this.client), new CommandRevolution(this.client), new CommandPet(this.client)];
  }

  start() {
    this.client.login(process.env.DISCORD_BOT_TOKEN || "");
  }
}

const bot = new Bot();

bot.start();
