export const config = {
  bibleApiBase: 'https://bible-api.com',
  biblehub: {
    base: 'https://api.parse.bot',
    scraperId: '0a2a8344-f84d-41c5-9ec5-793cc6306540',
    apiKey: process.env.EXPO_PUBLIC_BIBLEHUB_API_KEY ?? '',
  },
};

export const isBibleHubConfigured = (): boolean => {
  return !!config.biblehub.apiKey;
};

export const getBibleHubAuthHeader = (): Record<string, string> => {
  return {
    'X-API-Key': config.biblehub.apiKey,
  };
};