import * as config from 'config'
import { User } from 'idam/user'
import * as ld from 'ldclient-node'

const sdkKey: string = config.get<string>('secrets.cmc.launchDarkly-sdk-key')
const isOffline = config.get<boolean>('launchDarkly.offline')

// Create a silent logger for offline mode to suppress warnings during tests
const silentLogger: ld.LDLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {}
}

const ldConfig = {
  offline: isOffline,
  logger: isOffline ? silentLogger : undefined
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

  async userVariation (user: User, roles: string[], featureKey: string, offlineDefault): Promise<ld.LDFlagValue> {
    const ldUser: ld.LDUser = {
      key: user.id,
      custom: {
        roles
      }
    }
    return LaunchDarklyClient.client.variation(featureKey, ldUser, offlineDefault)
  }

  async serviceVariation (featureKey: string, offlineDefault): Promise<ld.LDFlagValue> {
    const roles: string[] = []
    const ldUser: ld.LDUser = {
      key: 'citizen-frontend',
      custom: {
        roles
      }
    }
    return LaunchDarklyClient.client.variation(featureKey, ldUser, offlineDefault)
  }
}
