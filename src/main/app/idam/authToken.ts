export class AuthToken {

  accessToken?: string

  tokenType?: string

  expiresIn?: number

  constructor (accessToken?: string, tokenType?: string, expiresIn?: number) {
    this.accessToken = accessToken
    this.tokenType = tokenType
    this.expiresIn = expiresIn
  }
}
