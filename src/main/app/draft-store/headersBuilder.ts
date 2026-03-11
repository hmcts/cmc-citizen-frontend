import { Secrets } from './secrets'

export class HeadersBuilder {
  static buildHeaders (userAuthToken: string, serviceAuthToken: string, secrets?: Secrets): object {
    const headers: any = {
      'Authorization': `Bearer ${userAuthToken}`,
      'ServiceAuthorization': `Bearer ${serviceAuthToken}`
    }
    if (secrets) {
      headers['Secret'] = secrets.asHeader()
    }
    return headers
  }
}
