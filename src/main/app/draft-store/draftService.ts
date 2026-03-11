import { ServiceAuthTokenFactory } from './serviceAuthTokenFactory'
import { DraftStoreClient } from './draftStoreClient'
import { Draft } from './draft'
import { Secrets } from './secrets'

export class DraftService {
  constructor (
    private draftStoreUri: string,
    private request: any,
    private serviceAuthTokenFactory: ServiceAuthTokenFactory
  ) {}

  private async createClient<T> (): Promise<DraftStoreClient<T>> {
    const serviceAuthToken = await this.serviceAuthTokenFactory.get()
    return new DraftStoreClient<T>(this.draftStoreUri, serviceAuthToken.bearerToken, this.request)
  }

  async find<T> (
    draftType: string,
    limit: string = '100',
    userToken: string,
    deserializationFn: (value: any) => T,
    secrets?: Secrets
  ): Promise<Draft<T>[]> {
    const client = await this.createClient<T>()
    return client.find({ type: draftType, limit }, userToken, deserializationFn, secrets)
  }

  async save<T> (draft: Draft<T>, userToken: string, secrets?: Secrets): Promise<void> {
    const client = await this.createClient<T>()
    return client.save(draft, userToken, secrets)
  }

  async delete<T> (draftId: number, userToken: string): Promise<void> {
    const client = await this.createClient<any>()
    return client.delete(draftId, userToken)
  }
}
