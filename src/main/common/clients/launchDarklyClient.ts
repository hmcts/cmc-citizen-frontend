import * as config from 'config'
import { User } from 'idam/user'
import * as ld from '@launchdarkly/node-server-sdk'

const sdkKey: string = config.get<string>('secrets.cmc.launchDarkly-sdk-key')
const ldConfig: ld.LDOptions = {
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

  async userVariation (user: User, roles: string[], featureKey: string, offlineDefault: ld.LDFlagValue): Promise<ld.LDFlagValue> {
    const ldContext: ld.LDContext = {
      kind: 'user',
      key: user.id,
      roles
    }
    return LaunchDarklyClient.client.variation(featureKey, ldContext, offlineDefault)
  }

  async serviceVariation (featureKey: string, offlineDefault: ld.LDFlagValue): Promise<ld.LDFlagValue> {
    const ldContext: ld.LDContext = {
      kind: 'user',
      key: 'citizen-frontend',
      roles: []
    }
    return LaunchDarklyClient.client.variation(featureKey, ldContext, offlineDefault)
  }
}
