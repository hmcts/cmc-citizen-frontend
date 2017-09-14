import * as config from 'config'
import * as HttpStatus from 'http-status-codes'
import request from 'client/request'

import { MomentFactory } from 'common/momentFactory'
import { Draft } from 'app/models/draft'

const draftStoreConfig = config.get<any>('draft-store')

if (draftStoreConfig.apiVersion !== 'v2') {
  throw new Error(`Draft store API ${draftStoreConfig.apiVersion} is not supported by the client`)
}

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
    this.endpointURL = `${draftStoreConfig.url}/api/${draftStoreConfig.apiVersion}/draft/${draftType}`
  }

  save (userId: number, draft: Draft): Promise<void> {
    draft.lastUpdateTimestamp = MomentFactory.currentDateTime().unix()
    return request.post(this.endpointURL, withAuthHeader(userId, {
      body: draft
    }))
  }

  retrieveById (userId: number, draftId: string, deserializationFn: (value: any) => T): Promise<T> {
    return request.get(this.endpointURL, withAuthHeader(userId))
      .then(draft => deserializationFn(draft))
      .catch(err => {
        if (err.statusCode === HttpStatus.NOT_FOUND) {
          return undefined
        } else {
          throw err
        }
      })
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
