const appConfig = {
  limits: {
    freeUser: {
      audioSubmissions: 5,
      chatMessages: 8,
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
