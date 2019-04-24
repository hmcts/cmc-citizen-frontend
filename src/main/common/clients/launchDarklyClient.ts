import * as config from 'config'
import { User } from 'idam/user'
import * as ld from 'ldclient-node'

const sdkKeys: string = config.get<string>('launchDarkly.sdk-keys.production')

export class LaunchDarklyClient {
  static client: ld.LDClient
  static initClient () {
    this.client = ld.init(sdkKeys)
  }

  callFeatureFlag (user: User, featureKey: string, f?: () => void) {
    let ldUser: ld.LDUser = {
      key: user.bearerToken
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
