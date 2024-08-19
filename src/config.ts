export default {
  embedChannel: process.env.LEADERBOARD_CHANNEL_ID as string,
  minecraft: {
    serverStatus: `${process.env.SERVER_API}/status`,
    serverPlayers: `${process.env.SERVER_API}/players`,
  },
};
