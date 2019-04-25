import * as config from 'config'
import { User } from 'idam/user'
import * as ld from 'ldclient-node'

const sdkKeys: string = config.get<string>('featureFlags.keys.sdk')
const client: ld.LDClient = ld.init(sdkKeys)

export class LaunchDarklyClient {

  callFeatureFlag (user: User, featureKey: string, f?: () => void): void {
    const ldUser: ld.LDUser = {
      key: user.id
    }
    client.on('ready', function () {
      client.variation(featureKey, ldUser, false, (value: ld.LDFlagValue) => {
        if (value) {
          f()
        }
      })
    })
  }
}
