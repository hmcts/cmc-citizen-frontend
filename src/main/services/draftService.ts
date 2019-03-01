import * as config from 'config'
import { request } from 'client/request'
import { Draft, DraftService as BaseDraftService, Secrets } from '@hmcts/draft-store-client'

import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

export class DraftService extends BaseDraftService {
  private secrets: Secrets

  constructor () {
    super(config.get<string>('draft-store.url'), request, new ServiceAuthTokenFactoryImpl())

    this.secrets =
      new Secrets(
        config.get<string>('secrets.cmc.citizen-draft-store-primary'),
        config.get<string>('secrets.cmc.citizen-draft-store-secondary')
      )
  }

  find<T> (draftType: string, limit: string | any, userToken: string, deserializationFn: (value: any) => T): Promise<Draft<T>[]> {
    return super.find(draftType, limit, userToken, deserializationFn, this.secrets)
  }

  save<T> (draft: Draft<T>, userToken: string): Promise<void> {
    return super.save(draft, userToken, this.secrets)
  }
}
