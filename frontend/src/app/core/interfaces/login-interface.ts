export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginApiResponse {
  access_token: string
}

export interface LoginResponse {
  accessToken: string
}
