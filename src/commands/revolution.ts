import { Client, Message } from "discord.js";
import Command from "./command";
import prisma from "../db";
import { Cache } from "../cache";

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

    let multiplier = 1;
    let base;

    if (user.givenTreats) {
      base = Math.floor(Math.random() * 6) + 5;
      multiplier = 5;
    } else {
      base = Math.floor(Math.random() * 10) + 1;
    }

    const points = Math.round(base * multiplier);

    let risk = (100 - 5 * user.revolutionStreak) / 100;

    const failed = Math.random() > risk;

    if (failed && !user.givenTreats) {
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
        givenTreats: false,
      },
    });

    message.reply(
      `The revolution was a success! ${user.username} gained ${points} points and is now at ${newUser.points}.`
    );
  }
}
