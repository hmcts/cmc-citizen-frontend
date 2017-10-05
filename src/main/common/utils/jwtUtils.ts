import { Base64 } from 'js-base64'

export class JwtUtils {
  static decodePayload (jwt: string): {[key: string]: any} {
    try {
      const payload = jwt.substring(jwt.indexOf('.'), jwt.lastIndexOf('.'))
      return JSON.parse(Base64.decode(payload))
    } catch (err) {
      throw new Error(`Unable to parse JWT token: ${jwt}`)
    }
  }
}
