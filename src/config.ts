export default {
  leaderboardChannel: process.env.LEADERBOARD_CHANNEL_ID as string,
  minecraft: {
    minecraftChannel: process.env.MINECRAFT_CHANNEL_ID as string,
    serverStatus: `${process.env.SERVER_API}/status`,
    serverPlayers: `${process.env.SERVER_API}/players`,
  },
};
