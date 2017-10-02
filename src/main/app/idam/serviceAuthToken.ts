import { Base64 } from 'js-base64'
import * as moment from 'moment'

function decodePayload (jwt: string) {
  try {
    const payload = jwt.substring(jwt.indexOf('.'), jwt.lastIndexOf('.'))
    return JSON.parse(Base64.decode(payload))
  } catch (err) {
    throw new Error(`Unable to parse JWT token: ${jwt}`)
  }
}

export default class ServiceAuthToken {
  constructor (public bearerToken: string) {
    this.bearerToken = bearerToken
  }

  hasExpired (): boolean {
    const { exp } = decodePayload(this.bearerToken)
    return moment().unix() > exp
  }
}
