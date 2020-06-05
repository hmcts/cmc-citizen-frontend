import { expect } from 'chai'

import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'

describe('ScannedDocumentsClient', () => {
  const client: ScannedDocumentsClient = new ScannedDocumentsClient()
  const bearerToken = 'IUgiYGOFUHSODFIUGHPASIYYUGLIYFGKUTF&TF'
  const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8'

  it('should throw error when given undefined ExternalId', () => {
    expect(() => client.getScannedResponseFormPDF(
      undefined, bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when given empty ExternalId', () => {
    expect(() => client.getScannedResponseFormPDF('', bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when not given undefined bearerToken', () => {
    expect(() => client.getScannedResponseFormPDF(externalId, undefined))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

  it('should throw error when not given an empty bearerToken', () => {
    expect(() => client.getScannedResponseFormPDF(externalId, ''))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

})
