let token: string | null = null;

export const setAuthToken = (newToken: string) => {
  token = newToken;
};

export const getAuthToken = () => token;
