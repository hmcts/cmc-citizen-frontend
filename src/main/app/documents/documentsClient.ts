import * as config from 'config'
import { requestNonPromise } from 'app/client/request'
import * as http from 'http'
import { StringUtils } from 'app/utils/stringUtils'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
  }

  getResponseCopy (claimExternalId: string): http.IncomingMessage {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/defendantResponseCopy/${claimExternalId}`
    })
  }

  getSettlementAgreementCopy (claimExternalId: string): http.IncomingMessage {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/settlementAgreement/${claimExternalId}`
    })
  }

  getClaimIssueCopy (claimExternalId: string): http.IncomingMessage {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/claimIssueReceipt/${claimExternalId}`
    })
  }
  getDefendantResponseReceipt (claimExternalId: string): http.IncomingMessage {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/defendantResponseReceipt/${claimExternalId}`
    })
  }

}
