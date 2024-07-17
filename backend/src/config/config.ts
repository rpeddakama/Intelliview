const appConfig = {
  limits: {
    freeUser: {
      audioSubmissions: 4,
      chatMessages: 10,
    },
    premiumUser: {
      audioSubmissions: Infinity,
      chatMessages: Infinity,
    },
  },
  api: {
    openAI: {
      model: "gpt-4",
      maxTokens: 500,
    },
  },
};

export default appConfig;
