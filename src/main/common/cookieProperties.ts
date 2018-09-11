export class CookieProperties {

  static getCookieParameters () {
    return {
      signed: true,
      httpOnly: true,
      maxAge: 7889238000,
      secure: true,
      sameSite: true
    }
  }

  static getCookieConfig () {
    return {
      options: {
        algorithm: 'aes128'
      }
    }
  }
}
