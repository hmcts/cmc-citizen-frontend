import * as nock from 'nock'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'

const mockClient = 'http://localhost'

describe('ScannedDocumentsClient', () => {
  const client: ScannedDocumentsClient = new ScannedDocumentsClient()
  const bearerToken = 'IUgiYGOFUHSODFIUGHPASIYYUGLIYFGKUTF&TF'
  const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8'

  chai.use(chaiAsPromised)

  it('should should retrieve the scanned response form for a case', () => {

    const expectedResponse = {
      url: 'http://localhost/scanneddoc'
    }

    nock(mockClient)
      .get(/\/scanned-documents\/.+/)
      .reply(200, expectedResponse)
    return client.getScannedResponseFormPDF('C333CC', 'bearer')
      .then((response: any) => {
        chai.expect(response).eql(expectedResponse)
      })
  })

  it('should should retreive the scanned response form for a case', () => {

    chai.expect(() => client.getScannedResponseFormPDF(
      undefined, bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when given undefined ExternalId', () => {
    chai.expect(() => client.getScannedResponseFormPDF(
      undefined, bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when given empty ExternalId', () => {
    chai.expect(() => client.getScannedResponseFormPDF('', bearerToken))
      .to.throw(Error, 'Claim external ID cannot be blank')
  })

  it('should throw error when not given undefined bearerToken', () => {
    chai.expect(() => client.getScannedResponseFormPDF(externalId, undefined))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

  it('should throw error when not given an empty bearerToken', () => {
    chai.expect(() => client.getScannedResponseFormPDF(externalId, ''))
      .to.throw(Error, 'User authorisation cannot be blank')
  })

})
