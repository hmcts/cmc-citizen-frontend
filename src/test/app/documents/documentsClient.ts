import { expect } from 'chai'

import { DocumentsClient } from 'documents/documentsClient'

describe('DocumentsClient', () => {
  const client: DocumentsClient = new DocumentsClient()
  const bearerToken = 'IUgiYGOFUHSODFIUGHPASIYYUGLIYFGKUTF&TF'
  const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8'

  it('should throw error when given undefined ExternalId', () => {
    expect(() => client.getDefendantResponseReceiptPDF(
      undefined, bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when given empty ExternalId', () => {
    expect(() => client.getDefendantResponseReceiptPDF('', bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when not given undefined bearerToken', () => {
    expect(() => client.getDefendantResponseReceiptPDF(externalId, undefined))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

  it('should throw error when not given an empty bearerToken', () => {
    expect(() => client.getDefendantResponseReceiptPDF(externalId, ''))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

  it('should throw error when not given an empty bearerToken to getPDF', () => {
    expect(() => client.getPDF(externalId, 'ORDER_DIRECTIONS', ''))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

  it('should throw error when given empty ExternalId to getPDF', () => {
    expect(() => client.getPDF('', 'ORDER_DIRECTIONS', bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

})
