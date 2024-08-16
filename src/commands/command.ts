import { Client, Message } from "discord.js";
import prisma from "../db";
import Logger from "../util/logger";

export default class Command {
  private bot: Client;
  public name: string;
  public description: string;
  public prefix: string;
  public requiresAdmin: boolean;

  constructor(
    bot: Client,
    name: string,
    description: string = "",
    requiresAdmin: boolean = false
  ) {
    this.bot = bot;
    this.name = name;
    this.description = description;
    this.prefix = "!";
    this.requiresAdmin = requiresAdmin;
    this.init();
  }

  async init() {
    this.bot.on("messageCreate", async (message: Message) => {
      if (
        message.author.bot ||
        !message.content.toLowerCase().startsWith(this.prefix + this.name)
      )
        return;

      if (
        this.requiresAdmin &&
        !message.member?.permissions.has("Administrator")
      ) {
        // This is an admin command that the user does not have access to
        return;
      }

      // Create user if it does not exist
      await prisma.user.upsert({
        where: {
          discordId: message.author.id,
        },
        create: {
          discordId: message.author.id,
          username: message.member?.displayName || message.author.username,
        },
        update: {
          username: message.member?.displayName || message.author.username,
        },
      });

      Logger.Info(
        `Command ${this.prefix}${this.name} executed by ${message.author.username}`
      );

      this.action(message);
    });
  }

  async action(message: Message): Promise<any> {
    // Stub
  }
}
