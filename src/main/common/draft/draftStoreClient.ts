import * as config from 'config'
import request from 'client/request'

import { Draft } from 'app/models/draft'
import { MomentFactory } from 'common/momentFactory'
import { DraftDocument } from 'models/draftDocument'

const endpointURL: string = `${config.get<any>('draft-store').url}/drafts`

export default class DraftStoreClient<T extends DraftDocument> {
  private serviceAuthToken: string

  constructor (serviceAuthToken: string) {
    this.serviceAuthToken = serviceAuthToken
  }

  find (query: { [key: string]: string }, userAuthToken: string, deserializationFn: (value: any) => T): Promise<Draft<T>[]> {
    const { type, ...qs } = query

    return request
      .get(endpointURL, {
        qs: qs,
        headers: this.authHeaders(userAuthToken)
      })
      .then((response: any) => {
        return response.data
          .filter(draft => type ? draft.type === type : true)
          .map(draft => {
            return new Draft(
              draft.id,
              draft.type,
              deserializationFn(draft.document),
              MomentFactory.parse(draft.created),
              MomentFactory.parse(draft.updated)
            )
          })
      })
  }

  save (draft: Draft<T>, userAuthToken: string): Promise<void> {
    const options = {
      headers: this.authHeaders(userAuthToken),
      body: {
        type: draft.type,
        document: draft.document
      }
    }

    if (!draft.id) {
      return request.post(endpointURL, options)
    } else {
      return request.put(`${endpointURL}/${draft.id}`, options)
    }
  }

  delete (draft: Draft<T>, userAuthToken: string): Promise<void> {
    if (!draft.id) {
      throw new Error('Draft does not have an ID - it cannot be deleted')
    }

    return request.delete(`${endpointURL}/${draft.id}`, {
      headers: this.authHeaders(userAuthToken)
    })
  }

  private authHeaders (userAuthToken: string) {
    return {
      'Authorization': `Bearer ${userAuthToken}`,
      'ServiceAuthorization': `Bearer ${this.serviceAuthToken}`
    }
  }
}
