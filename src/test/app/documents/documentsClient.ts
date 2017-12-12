import { expect } from 'chai'

import { DocumentsClient } from 'app/documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()

  describe('DocumentClient', () => {

    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getDefendantResponseReceiptPDF(
        undefined))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getDefendantResponseCopyPDF(''))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
