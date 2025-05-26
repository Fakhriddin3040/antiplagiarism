export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenApiResponse {
  access_token: string
}

export interface TokenResponse {
  accessToken: string
}
