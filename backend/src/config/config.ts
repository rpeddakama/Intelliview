const appConfig = {
  limits: {
    freeUser: {
      audioSubmissions: 2,
      chatMessages: 5,
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
