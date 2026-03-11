import * as moment from 'moment'
import { Draft } from './draft'
import { Secrets } from './secrets'
import { HeadersBuilder } from './headersBuilder'

export class DraftStoreClient<T> {
  constructor (
    private endpointURL: string,
    private serviceAuthToken: string,
    private request: any
  ) {}

  find (
    query: { [key: string]: string },
    userAuthToken: string,
    deserializationFn: (value: any) => T,
    secrets?: Secrets
  ): Promise<Draft<T>[]> {
    const { type, ...qs } = query
    const endpointURL = `${this.endpointURL}/drafts`
    return this.request
      .get(endpointURL, {
        qs,
        headers: HeadersBuilder.buildHeaders(userAuthToken, this.serviceAuthToken, secrets)
      })
      .then((response: any) => {
        return response.data
          .filter((draft: any) => type ? draft.type === type : true)
          .map((draft: any) => new Draft<T>(
            draft.id,
            draft.type,
            deserializationFn(draft.document),
            moment(draft.created),
            moment(draft.updated)
          ))
      })
  }

  save (draft: Draft<T>, userAuthToken: string, secrets?: Secrets): Promise<void> {
    const options = {
      headers: HeadersBuilder.buildHeaders(userAuthToken, this.serviceAuthToken, secrets),
      body: {
        type: draft.type,
        document: draft.document
      }
    }
    const endpointURL = `${this.endpointURL}/drafts`
    if (!draft.id) {
      return this.request.post(endpointURL, options)
    } else {
      return this.request.put(`${endpointURL}/${draft.id}`, options)
    }
  }

  delete (draftId: number, userAuthToken: string): Promise<void> {
    if (!draftId) {
      throw new Error('Draft does not have an ID - it cannot be deleted')
    }
    const endpointURL = `${this.endpointURL}/drafts`
    return this.request.delete(`${endpointURL}/${draftId}`, {
      headers: HeadersBuilder.buildHeaders(userAuthToken, this.serviceAuthToken)
    })
  }
}
