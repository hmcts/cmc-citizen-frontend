import * as moment from 'moment'
import { JwtUtils } from 'shared/utils/jwtUtils'

export class ServiceAuthToken {
  constructor (public bearerToken: string) {
    this.bearerToken = bearerToken
  }

  hasExpired (): boolean {
    const { exp } = JwtUtils.decodePayload(this.bearerToken)
    return moment().unix() >= exp
  }
}
