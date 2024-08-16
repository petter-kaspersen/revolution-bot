import { Client, Message } from "discord.js";
import Command from "./command";
import prisma from "../db";

export class CommandTreat extends Command {
  constructor(bot: Client) {
    super(bot, "treat", "Give a treat to the revolting peasants");
  }

  async action(message: Message) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        discordId: message.author.id,
      },
    });

    const lastTreated = user.lastTreated;

    // Check if last treated is less than 60 seconds ago
    if (lastTreated && lastTreated.getTime() > Date.now() - 60000) {
      message.reply(
        `You can only treat the bot once every 60 seconds. You can try again in ${Math.ceil(
          (lastTreated.getTime() + 60000 - Date.now()) / 1000
        )} seconds.`
      );
      return;
    }

    const newUser = await prisma.user.update({
      where: {
        discordId: message.author.id,
      },
      data: {
        treats: {
          increment: 1,
        },
        lastTreated: new Date(),
        revolutionStreak: 0,
      },
    });

    message.reply(
      `Nice job, ${user?.username}, you gave a treat to the all-seeing revolution overlord! You're now at ${newUser.treats} treats.  🍬`
    );
  }
}
