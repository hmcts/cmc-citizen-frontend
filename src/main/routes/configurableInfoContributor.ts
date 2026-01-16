import * as express from 'express'
import * as requestPromise from 'request-promise-native'
import { RequestPromiseOptions } from 'request-promise-native'
import { InfoContributor } from '@hmcts/info-provider'

export class ConfigurableInfoContributor extends InfoContributor {
  constructor (serviceUrl: string, private readonly requestOptions?: RequestPromiseOptions) {
    super(serviceUrl)
  }

  async call (): Promise<object> {
    if (!this.requestOptions) {
      return super.call()
    }

    try {
      return await requestPromise.get({
        uri: this.url,
        json: true,
        ...this.requestOptions
      })
    } catch (error) {
      return {
        error: `Error calling ${this.url}`,
        statusText: error?.message,
        body: error?.response?.body
      }
    }
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
