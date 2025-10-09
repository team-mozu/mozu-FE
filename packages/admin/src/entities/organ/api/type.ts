export type OrganLoginRequest = {
  code: string;
  password: string;
};

export type OrganLoginResponse = {
  accessToken: string;
  refreshToken: string;
  accessExpiredAt: string;
  refreshExpiredAt: string;
};
