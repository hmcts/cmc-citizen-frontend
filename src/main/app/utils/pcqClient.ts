import * as express from 'express'
import { RoutablePath } from 'shared/router/routablePath'
import { buildURL } from 'utils/callbackBuilder'
import * as config from 'config'
import { BaseParameters, InvokingParameters } from './models/pcqParameters'
import { TokenGenerator } from './tokenGenerator'
const request = require('request-promise-native')

const pcqBaseUrl: string = `${config.get<string>('pcq.url')}`
const serviceId = 'CMC'
export interface GetServiceEndpointParameters {
  actor: string
  ccdCaseId?: string
  partyId: string
  returnUrl: string
  language?: string
}
export class PcqClient {
  static async isEligibleRedirect (pcqID: string, partyType: string): Promise<boolean> {
    let health = false
    return request.get(pcqBaseUrl + '/health', {
      'json': true
    })
        .catch(e => {
          return false
        })
        .then((response) => {
          if (response['status'] === 'UP' && pcqID === undefined && partyType === 'individual') {
            health = true
          }
          return health
        })
  }
  static generateRedirectUrl (req: express.Request,
      claimtype: string, pcqID: string, partyEmailId: string, ccdCaseId: number,
      receiver: RoutablePath, externalId: string): string {
    if (receiver === undefined) {
      throw new Error('Request is undefined')
    }
    let ccdId = ''
    if (ccdCaseId) {
      ccdId = ccdCaseId.toString()
    }
    const returnUri = (buildURL(req, receiver.uri).split('https://')[1]).replace(':externalId', externalId)
    const redirectUri = this.getServiceEndpoint(ccdId, partyEmailId,pcqID,returnUri,serviceId,claimtype)
    return redirectUri
  }
  static getServiceEndpoint (ccdCaseId: string, partyId: string, pcqId: string, returnUri: string, actorCmc: string, claimtype: string): string {
    const baseParameters: BaseParameters = {
      pcqId: pcqId,
      serviceId: actorCmc,
      actor: claimtype,
      ccdCaseId: ccdCaseId,
      partyId: partyId,
      returnUrl: returnUri,
      language: 'en'
    }
    const invokingParameters: InvokingParameters = {
      ...baseParameters,
      token: TokenGenerator.gen(baseParameters)
    }
    const qs = Object.keys(invokingParameters)
        .map(key => key + '=' + invokingParameters[key])
        .join('&')
    return `${pcqBaseUrl}/service-endpoint?${qs}`
  }
}
