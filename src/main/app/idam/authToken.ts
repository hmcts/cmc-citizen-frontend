export class AuthToken {
  constructor (public readonly accessToken: string, public readonly tokenType: string, public readonly expiresIn: number) {
    this.accessToken = accessToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
  }
}
