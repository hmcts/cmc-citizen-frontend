import * as config from 'config'
import { requestNonPromise } from 'client/request'
import { Request } from 'request'
import { StringUtils } from 'utils/stringUtils'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
  }

  getClaimIssueReceiptPDF (claimExternalId: string): Request {
    return this.getPDF(claimExternalId, 'claimIssueReceipt')
  }

  getDefendantResponseReceiptPDF (claimExternalId: string): Request {
    return this.getPDF(claimExternalId, 'defendantResponseReceipt')
  }

  getSettlementAgreementPDF (claimExternalId: string): Request {
    return this.getPDF(claimExternalId, 'settlementAgreement')
  }

  private getPDF (claimExternalId: string, documentTemplate: string): Request {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    if (StringUtils.isBlank(documentTemplate)) {
      throw new Error('Document template cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/${documentTemplate}/${claimExternalId}`
    })
  }

}
