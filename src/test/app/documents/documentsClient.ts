import { expect } from 'chai'

import DocumentsClient from 'app/documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()

  describe('getResponseCopy', () => {
    it('shouldThrowErrorWhenGivenUndefinedExternalId', () => {
      expect(() => client.getResponseCopy(undefined)).to.throw(Error, 'Claim external ID cannot be blank')
    })

    it('shouldThrowErrorWhenGivenEmptyExternalId', () => {
      expect(() => client.getResponseCopy('')).to.throw(Error, 'Claim external ID cannot be blank')
    })
  })
})
