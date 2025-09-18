export class AuthRequest {
  private _username!: string;
  private _password!: string;

  public constructor(
    username: string,
    password: string,
  ) {
    this.username = username;
    this.password = password
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    return this._password;
  }

  set username(value: string) {
    value = value.trim()

    if (!value) {
      throw new Error(`Invalid username: ${value}`);
    }

    this._username = value;
  }

  set password(value: string) {
    value = value.trim()

    if (!value) {
      throw new Error(`Invalid password: ${value}`);
    }

    this._password = value;
  }
}
