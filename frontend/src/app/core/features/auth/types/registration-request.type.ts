export class RegistrationRequest {
  private _firstName!: string;
  private _lastName!: string;
  private _email!: string;
  private _password!: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this._password = password;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this.validateString(value);
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this.validateString(value);
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this.validateString(value);
    this._email = value;
  }

  private set password(value: string) {
    this.validateString(value);
    this._password = value;
  }

  private validateString(value: string): void {
    if (value.trim() === '') {
      throw new Error('Value must be a non-empty string');
    }
  }
}
