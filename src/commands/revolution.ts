import { Client, Message } from "discord.js";
import Command from "./command";
import prisma from "../db";

export class CommandRevolution extends Command {
  constructor(bot: Client) {
    super(bot, "revolution", "Revolt, rise up peasants!");
  }

  async action(message: Message) {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        discordId: message.author.id,
      },
    });

    let multiplier = (10 + user.treats + user.revolutionStreak) / 10;

    const base = Math.floor(Math.random() * 10) + 1;
    const points = Math.round(base * multiplier);

    let risk = (100 - (5 + user.revolutionStreak)) / 100;

    const failed = Math.random() > risk;

    if (failed) {
      const newUser = await prisma.user.update({
        where: {
          discordId: message.author.id,
        },
        data: {
          points: {
            decrement: points,
          },
        },
      });

      return message.reply(
        `The revolution failed! ${user.username} lost ${points} points and is now at ${newUser.points}.`
      );
    }

    const newUser = await prisma.user.update({
      where: {
        discordId: message.author.id,
      },
      data: {
        points: {
          increment: points,
        },
        revolutionStreak: {
          increment: 1,
        },
      },
    });

    message.reply(
      `The revolution was a success! ${user.username} gained ${points} points and is now at ${newUser.points}.`
    );
  }
}
