import * as config from 'config'
import { User } from 'idam/user'
import * as ld from 'ldclient-node'

const sdkKey: string = config.get<string>('secrets.cmc.launchDarkly-sdk-key')
const ldConfig = {
  offline: config.get<boolean>('launchDarkly.offline')
}

export class LaunchDarklyClient {
  private static client: ld.LDClient

  constructor () {
    LaunchDarklyClient.initClient()
  }

  static initClient () {
    if (!LaunchDarklyClient.client) {
      LaunchDarklyClient.client = ld.init(sdkKey, ldConfig)
    }
  }

  async variation (user: User, roles: string[], featureKey: string, offlineDefault): Promise<ld.LDFlagValue> {
    const ldUser: ld.LDUser = {
      key: user.id,
      custom: {
        roles
      }
    }
    return LaunchDarklyClient.client.variation(featureKey, ldUser, offlineDefault)
  }
}
