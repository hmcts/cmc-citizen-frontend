import DraftStoreClient from 'common/draft/draftStoreClient'
import { DraftDocument } from 'models/draftDocument'
import ServiceAuthToken from 'idam/serviceAuthToken'
import { ServiceAuthTokenFactory } from 'common/security/serviceTokenFactory'

export class DraftStoreClientFactory {
  static async create <T extends DraftDocument> (): Promise<DraftStoreClient<T>> {
    const serviceAuthToken: ServiceAuthToken = await ServiceAuthTokenFactory.get()
    return new DraftStoreClient(serviceAuthToken.bearerToken)
  }
}
