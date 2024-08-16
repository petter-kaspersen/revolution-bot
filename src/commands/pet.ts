import { Client, Message } from "discord.js";
import Command from "./command";
import prisma from "../db";

export class CommandPet extends Command {
  constructor(bot: Client) {
    super(bot, "pet", "Give the bot a pet");
  }

  async action(message: Message) {
    // Give 1% chance to bonk instead
    if (Math.random() < 0.01) {
      return message.reply(
        `You tried to pet the bot, but it bonked you instead!`
      );
    }

    message.reply(`The bot appreciates the pets! :3`);
  }
}
