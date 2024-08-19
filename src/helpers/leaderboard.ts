import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { Helper } from "./helper";
import config from "../config";
import { Cache } from "../cache";
import { user } from "@prisma/client";
import prisma from "../db";

const padNameTo = (name: string, length: number) => {
  if (name.length >= length) {
    return name;
  }

  return name + " ".repeat(length - name.length + 1);
};

export class Leaderboard extends Helper {
  constructor(bot: Client) {
    super(bot);
  }

  async init() {
    this.updateLeaderboard();

    setInterval(this.updateLeaderboard.bind(this), 1000 * 60);
  }

  async updateLeaderboard() {
    const users = await prisma.user.findMany();

    const messageId = Cache.get("leaderboardChannel");

    const channel = await this.getLeaderboardChannel();

    const embed = this.constructEmbed(users);

    if (messageId) {
      const message = await channel.messages.fetch(messageId);

      await message.edit({ embeds: [embed] });
    } else {
      const message = await channel.send({
        embeds: [embed],
      });

      Cache.set("leaderboardChannel", message.id);
    }
  }

  async getLeaderboardChannel() {
    return this.bot.channels.cache.get(config.embedChannel) as TextChannel;
  }

  constructEmbed(users: user[]) {
    const sortedUsers = users.sort((a, b) => b.points - a.points);

    const longestUsername = sortedUsers.reduce(
      (acc, user) =>
        [...user.username].length > acc ? [...user.username].length : acc,
      0
    );

    const fields = sortedUsers
      .map(
        (user, i) =>
          `#${i + 1}\t\t${padNameTo(user.username, longestUsername)}\t\t${
            user.points
          }`
      )
      .join("\n");

    return new EmbedBuilder()
      .setColor("#FFC0CB")
      .setTitle(`Vive la révolution!`)
      .addFields({
        name: "Leaderboard",
        value: `\`\`\`${fields}\`\`\``,
      })
      .setTimestamp();
  }
}
