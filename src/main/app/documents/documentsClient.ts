import * as config from 'config'
import { requestNonPromise } from 'client/request'
import { Request } from 'request'
import { StringUtils } from 'utils/stringUtils'
import { User } from 'idam/user'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
  }

  getClaimIssueReceiptPDF (claimExternalId: string, user: User): Request {
    return this.getPDF(claimExternalId, 'claimIssueReceipt', user.bearerToken)
  }

  getDefendantResponseReceiptPDF (claimExternalId: string, user: User): Request {
    return this.getPDF(claimExternalId, 'defendantResponseReceipt', user.bearerToken)
  }

  getSettlementAgreementPDF (claimExternalId: string, user: User): Request {
    return this.getPDF(claimExternalId, 'settlementAgreement', user.bearerToken)
  }

  private getPDF (claimExternalId: string, documentTemplate: string, bearerToken: string): Request {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    if (StringUtils.isBlank(documentTemplate)) {
      throw new Error('Document template cannot be blank')
    }
    if (StringUtils.isBlank(bearerToken)) {
      throw new Error('User authorisation cannot be blank')
    }
    return requestNonPromise.get(
      `${this.documentsUrl}/${documentTemplate}/${claimExternalId}`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`
        }
      }
    )
  }
}
