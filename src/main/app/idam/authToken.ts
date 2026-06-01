export class AuthToken {
  constructor (public readonly accessToken: string, public readonly idToken: string, public readonly tokenType: string, public readonly expiresIn: number) {
    this.accessToken = accessToken
    this.idToken = idToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
  }
}
