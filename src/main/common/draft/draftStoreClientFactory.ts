import DraftStoreClient from 'common/draft/draftStoreClient'
import { Draft } from 'models/draft'
import IdamClient from 'idam/idamClient'
import ServiceAuthToken from 'idam/serviceAuthToken'

export class DraftStoreClientFactory {
  static async create <T extends Draft> (): Promise<DraftStoreClient<T>> {
    const serviceAuthToken: ServiceAuthToken = await IdamClient.retrieveServiceToken()
    return new DraftStoreClient(serviceAuthToken.bearerToken)
  }
}
