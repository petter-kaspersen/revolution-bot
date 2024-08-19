import "dotenv/config";

import { Client, GatewayIntentBits, Partials } from "discord.js";
import Logger from "./util/logger";
import Command from "./commands/command";
import { CommandTreat } from "./commands/treat";
import { CommandRevolution } from "./commands/revolution";
import { CommandPet } from "./commands/pet";
import { Helper } from "./helpers/helper";
import { Leaderboard } from "./helpers/leaderboard";

import { Cache } from "./cache";
import { Minecraft } from "./helpers/minecraft";

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
  private helpers: Helper[] = this.registerHelpers();
  constructor() {
    this.addListeners();
    new Cache();
  }

  addListeners() {
    this.client.on("ready", () => {
      Logger.Info("Bot online");
    });
  }

  registerHelpers() {
    return [new Leaderboard(this.client), new Minecraft(this.client)];
  }

  registerCommands() {
    return [
      new CommandTreat(this.client),
      new CommandRevolution(this.client),
      new CommandPet(this.client),
    ];
  }

  start() {
    this.client.login(process.env.DISCORD_BOT_TOKEN || "");
  }
}

const bot = new Bot();

bot.start();
