import {LocalStorageKey} from '../../core/enums/local-storage-key.enum';

export class AuthHelper {
  static getToken(): string | null {
    return localStorage.getItem(LocalStorageKey.ACCESS_TOKEN);
  }
  static setToken(token: string): void {
    if (token.trim() === '') {
      throw new Error('Token cannot be empty or whitespace.');
    }
      localStorage.setItem(LocalStorageKey.ACCESS_TOKEN, token);
  }
}
