import { expect } from 'chai'

import { DocumentsClient } from 'app/documents/documentsClient'

const externalId = 'f8548372-df35-11e7-80c1-9a214cf093ae'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()

  describe('getPDF', () => {

    it('should throw error when given undefined ExternalId', () => {
      expect(() => client.getPDF(
        undefined,
        'defendantResponseCopy'))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty ExternalId', () => {
      expect(() => client.getPDF('',
        'defendantResponseCopy'))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('should throw error when given empty Document Template', () => {
      expect(() => client.getPDF(
        externalId,
        ''))
        .to.throw(Error, 'Document template cannot be blank')
    })

    it('shouldThrowErrorWhenGivenUndefinedDocumentTemplate', () => {
      expect(() => client.getPDF(
        externalId,
        undefined))
        .to.throw(Error, 'Document template is undefined')
    })
  })
})
