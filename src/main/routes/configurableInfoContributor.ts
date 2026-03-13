import * as express from 'express'
import { request } from 'client/request'
import { RequestOptions } from 'client/httpClient'
import { InfoContributor } from '@hmcts/info-provider'

export class ConfigurableInfoContributor extends InfoContributor {
  constructor (serviceUrl: string, private readonly requestOptions?: RequestOptions) {
    super(serviceUrl)
  }

  async call (): Promise<object> {
    if (!this.requestOptions) {
      return super.call()
    }

    try {
      return await request.get({
        uri: this.url,
        json: true,
        ...this.requestOptions
      })
    } catch (error) {
      return {
        error: `Error calling ${this.url}`,
        statusText: error?.message,
        body: error?.body ?? error?.response?.body ?? error?.response?.data
      }
    }
  }
}

/* tslint:disable:no-default-export */
export default express.Router()
