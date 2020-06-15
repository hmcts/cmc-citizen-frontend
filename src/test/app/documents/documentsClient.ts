import { expect } from 'chai'

import { DocumentsClient } from 'documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()
  const bearerToken = 'IUgiYGOFUHSODFIUGHPASIYYUGLIYFGKUTF&TF'
  const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8'

  context('getSealedClaimPDF', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getSealedClaimPDF(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getSealedClaimPDF('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getSealedClaimPDF(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getSealedClaimPDF(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getClaimIssueReceiptPDF', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getClaimIssueReceiptPDF(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getClaimIssueReceiptPDF('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getClaimIssueReceiptPDF(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getClaimIssueReceiptPDF(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getDraftClaimReceiptPDF', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getDraftClaimReceiptPDF(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getDraftClaimReceiptPDF('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getDraftClaimReceiptPDF(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getDraftClaimReceiptPDF(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getDefendantResponseReceiptPDF', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getDefendantResponseReceiptPDF(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getDefendantResponseReceiptPDF('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getDefendantResponseReceiptPDF(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getDefendantResponseReceiptPDF(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getClaimantHearingRequirementPDF', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getClaimantHearingRequirementPDF(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getClaimantHearingRequirementPDF('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getClaimantHearingRequirementPDF(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getClaimantHearingRequirementPDF(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getSettlementAgreementPDF', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getSettlementAgreementPDF(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getSettlementAgreementPDF('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getSettlementAgreementPDF(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getSettlementAgreementPDF(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getDirectionsOrder', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getDirectionsOrder(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getDirectionsOrder('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getDirectionsOrder(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getDirectionsOrder(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getReviewOrderPdf', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getReviewOrderPdf(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getReviewOrderPdf('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getReviewOrderPdf(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getReviewOrderPdf(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getMediationAgreementPdf', () => {
    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getMediationAgreementPdf(undefined, bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getMediationAgreementPdf('', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given undefined bearerToken', () => {
      expect(() => client.getMediationAgreementPdf(externalId, undefined))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given an empty bearerToken', () => {
      expect(() => client.getMediationAgreementPdf(externalId, ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })
  })

  context('getPDF', () => {
    it('should throw error when given an empty bearerToken to getPDF', () => {
      expect(() => client.getPDF(externalId, 'ORDER_DIRECTIONS', ''))
        .to.throw(Error, 'User authorisation cannot be blank')
    })

    it('should throw error when given empty ExternalId to getPDF', () => {
      expect(() => client.getPDF('', 'ORDER_DIRECTIONS', bearerToken))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
