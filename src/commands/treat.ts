import { Client, Message } from "discord.js";
import Command from "./command";
import prisma from "../db";

const isLessThan60Seconds = (lastTreated: Date) => {
  return lastTreated.getTime() > Date.now() - 60000;
};

export class CommandTreat extends Command {
  constructor(bot: Client) {
    super(bot, "treat <?person>", "Give a treat to the revolting peasants");
  }

  async action(message: Message) {
    let user = await prisma.user.findUniqueOrThrow({
      where: {
        discordId: message.author.id,
      },
    });

    const hasMentionedAnotherUser = message.mentions.users.size > 0;

    if (hasMentionedAnotherUser) {
      const mentionedUser = message.mentions.users.first();

      if (mentionedUser?.id === message.author.id) {
        return message.reply("You can't treat yourself! 🍬");
      }
    }

    const lastTreated = hasMentionedAnotherUser
      ? user.lastGivenTreat
      : user.lastTreated;

    // Check if last treated is less than 60 seconds ago
    if (lastTreated && isLessThan60Seconds(lastTreated)) {
      const replyMessage = hasMentionedAnotherUser
        ? `You can only treat someone else once every 60 seconds. You can try again in ${Math.ceil(
            (lastTreated.getTime() + 60000 - Date.now()) / 1000
          )} seconds.`
        : `You can only treat the bot once every 60 seconds. You can try again in ${Math.ceil(
            (lastTreated.getTime() + 60000 - Date.now()) / 1000
          )} seconds.`;

      message.reply(replyMessage);
      return;
    }

    let newUser;

    if (hasMentionedAnotherUser) {
      newUser = await prisma.user.update({
        where: {
          discordId: user.discordId,
        },
        data: {
          treats: {
            increment: 1,
          },
          givenTreats: true,
        },
      });

      await prisma.user.update({
        where: {
          discordId: message.author.id,
        },
        data: {
          lastGivenTreat: new Date(),
        },
      });
    } else {
      newUser = await prisma.user.update({
        where: {
          discordId: user.discordId,
        },
        data: {
          treats: {
            increment: 1,
          },
          lastTreated: new Date(),
          revolutionStreak: 0,
          givenTreats: true,
        },
      });
    }

    message.reply(
      `Nice job, ${user?.username}, you gave a treat to ${
        hasMentionedAnotherUser
          ? `<@${message.mentions.users.first()?.id}>`
          : "the all-seeing revolution overlord"
      }! ${hasMentionedAnotherUser ? "They are" : "You are"} now at ${
        newUser.treats
      } treats.  🍬`
    );
  }
}
