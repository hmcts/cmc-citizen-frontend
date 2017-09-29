import * as config from 'config'
import * as HttpStatus from 'http-status-codes'
import request from 'client/request'

import { MomentFactory } from 'common/momentFactory'
import { Draft } from 'app/models/draft'

const draftStoreConfig = config.get<any>('draft-store')

function withAuthHeader (userId: number, other: any = {}) {
  return Object.assign({
    headers: {
      'Authorization': `hmcts-id ${userId}`
    }
  }, other)
}

export default class DraftStoreClient<T> {
  private endpointURL: string

  constructor (draftType: string) {
    if (!draftType || draftType.trim() === '') {
      throw new Error('Draft type is required by the client')
    }
    this.endpointURL = `${draftStoreConfig.url}/api/v2/draft/${draftType}`
  }

  save (userId: number, draft: Draft): Promise<void> {
    draft.lastUpdateTimestamp = MomentFactory.currentDateTime().unix()
    return request.post(this.endpointURL, withAuthHeader(userId, {
      body: draft
    }))
  }

  retrieve (userId: number, deserializationFn: (value: any) => T): Promise<T> {
    return request
      .get(this.endpointURL, withAuthHeader(userId))
      .then(draft => deserializationFn(draft))
      .catch(err => {
        if (err.statusCode === HttpStatus.NOT_FOUND) {
          return undefined
        } else {
          throw err
        }
      })
  }

  delete (userId: number): Promise<void> {
    return request.delete(this.endpointURL, withAuthHeader(userId))
  }
}
