import * as config from 'config'
import { User } from 'idam/user'
import * as ld from 'ldclient-node'

const sdkKeys: string = config.get<string>('launchDarkly.sdk')

export class LaunchDarklyClient {
  private static client: ld.LDClient

  constructor () {
    LaunchDarklyClient.initClient()
  }

  static initClient () {
    if (!LaunchDarklyClient.client) {
      LaunchDarklyClient.client = ld.init(sdkKeys)
    }
  }

  callFeatureFlag (user: User, featureKey: string, f?: () => void): void {
    const ldUser: ld.LDUser = {
      key: user.id
    }
    LaunchDarklyClient.client.on('ready', function () {
      LaunchDarklyClient.client.variation(featureKey, ldUser, false, (value: ld.LDFlagValue) => {
        if (value) {
          f()
        }
      })
    })
  }
}
