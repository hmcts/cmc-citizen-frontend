import { expect } from 'chai'

import { DocumentsClient } from 'app/documents/documentsClient'

const externalId = 'f8548372-df35-11e7-80c1-9a214cf093ae'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()

  describe('getPDF', () => {

    it('shouldThrowErrorWhenGivenUndefinedExternalId', () => {
      expect(() => client.getPDF(
        undefined,
        'defendantResponseCopy'))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyExternalId', () => {
      expect(() => client.getPDF('',
        'defendantResponseCopy'))
        .to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyDocumentTemplate', () => {
      expect(() => client.getPDF(
        externalId,
        ''))
        .to.throw(Error, 'Document template cannot be blank')
    })
  })
})
