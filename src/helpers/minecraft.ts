import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { Helper } from "./helper";
import config from "../config";
import { Cache } from "../cache";

interface MinecraftPlayers {
  status: boolean;
  players: string[];
}

interface MinecraftStatus {
  status: {
    online: boolean;
    cpu: string;
    ram: string;
    version: string;
    players: {
      online: number;
      max: number;
    };
  };
}

export class Minecraft extends Helper {
  constructor(bot: Client) {
    super(bot);
  }

  async init() {
    this.updateMinecraft();

    setInterval(this.updateMinecraft.bind(this), 1000 * 60);
  }

  async updateMinecraft() {
    const messageId = Cache.get("minecraftChannel");

    const channel = await this.getMinecraftChannel();

    const players = await this.getServerPlayers();
    const status = await this.getServerStatus();

    if (!players || !status) {
      return;
    }

    const embed = this.constructEmbed(players, status);

    if (messageId) {
      const message = await channel.messages.fetch(messageId);

      await message.edit({ embeds: [embed] });
    } else {
      const message = await channel.send({
        embeds: [embed],
      });

      Cache.set("minecraftChannel", message.id);
    }
  }

  constructEmbed(players: MinecraftPlayers, status: MinecraftStatus) {
    return new EmbedBuilder()
      .setColor(status.status.online ? "#008000" : "#FF0000")
      .setTitle("Minecraft Server Status")
      .setDescription(`Last updated: ${new Date().toLocaleString("en-GB")}`)
      .addFields({
        name: "Online",
        value: status.status.online ? ":green_circle:" : ":red_circle:",
        inline: true,
      })
      .addFields({
        name: "Version",
        value: status.status.version,
        inline: true,
      })
      .addFields({
        name: "Players",
        value: `${status.status.players.online}/${status.status.players.max}`,
        inline: true,
      })
      .addFields({
        name: "Online Players",
        value: players.players.join(", ") || "No players online",
      })
  }

  async getMinecraftChannel() {
    return this.bot.channels.cache.get(config.minecraft.minecraftChannel) as TextChannel;
  }

  async getServerStatus() {
    return this.doRequest<MinecraftStatus>(config.minecraft.serverStatus);
  }

  async getServerPlayers() {
    return this.doRequest<MinecraftPlayers>(config.minecraft.serverPlayers);
  }

  async doRequest<T>(url: string): Promise<T | false> {
    try {
      const response = await fetch(url);

      return await response.json();
    } catch (e) {
      return false;
    }
  }
}
