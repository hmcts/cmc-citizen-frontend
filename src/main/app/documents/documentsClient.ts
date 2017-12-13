import * as config from 'config'
import { requestNonPromise } from 'client/request'
import { Request } from 'request'
import { StringUtils } from 'utils/stringUtils'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
  }

  getResponseCopy (claimExternalId: string): Request {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/defendantResponseCopy/${claimExternalId}`
    })
  }

  getSettlementAgreementCopy (claimExternalId: string): Request {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/settlementAgreement/${claimExternalId}`
    })
  }

}
