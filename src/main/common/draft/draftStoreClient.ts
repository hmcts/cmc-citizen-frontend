import * as config from 'config'
import request from 'client/request'

import { DraftDocument, Draft } from 'app/models/draft'
import { MomentFactory } from 'common/momentFactory'

const endpointURL: string = `${config.get<any>('draft-store').url}/drafts`

export default class DraftStoreClient<T extends DraftDocument> {
  private serviceAuthToken: string

  constructor (serviceAuthToken: string) {
    this.serviceAuthToken = serviceAuthToken
  }

  find (userAuthToken: string, type: string, deserializationFn: (value: any) => T): Promise<Draft<T>[]> {
    return request
      .get(endpointURL, {
        headers: this.authHeaders(userAuthToken)
      })
      .then((response: any) => {
        return response.data
          .filter(draft => type ? draft.type === type : true)
          .map(draft => {
            const wrapper = new Draft()
            wrapper.id = draft.id
            wrapper.type = draft.type
            wrapper.document = deserializationFn(draft.document)
            wrapper.created = MomentFactory.parse(draft.created)
            wrapper.updated = MomentFactory.parse(draft.updated)
            return wrapper
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
