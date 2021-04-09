import * as config from 'config'
import { request } from 'client/request'
import { StringUtils } from 'utils/stringUtils'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
  }

  getSealedClaimPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'sealedClaim', bearerToken)
  }

  getClaimIssueReceiptPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'claimIssueReceipt', bearerToken)
  }

  getDefendantResponseReceiptPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'defendantResponseReceipt', bearerToken)
  }

  getClaimantHearingRequirementPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'claimantHearingRequirement', bearerToken)
  }

  getSettlementAgreementPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'settlementAgreement', bearerToken)
  }

  getDirectionsOrder (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'ORDER_DIRECTIONS', bearerToken)
  }

  getReviewOrderPdf (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'REVIEW_ORDER', bearerToken)
  }
  getMediationAgreementPdf (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'MEDIATION_AGREEMENT', bearerToken)
  }

  getDraftClaimReceiptPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'draftClaimReceipt', bearerToken)
  }

  getPDF (claimExternalId: string, documentTemplate: string, bearerToken: string): Promise<Buffer> {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    if (StringUtils.isBlank(documentTemplate)) {
      throw new Error('Document template cannot be blank')
    }
    if (StringUtils.isBlank(bearerToken)) {
      throw new Error('User authorisation cannot be blank')
    }

    const options = {
      uri: `${this.documentsUrl}/${documentTemplate}/${claimExternalId}`,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: 'application/pdf'
      },
      encoding: null
    }

    return request(options).then(function (response) {
      return response
    })
  }
}
