/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import * as nock from 'nock'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'

const mockClient = 'http://localhost/scanned-documents'

describe('ScannedDocumentsClient', () => {
  const client: ScannedDocumentsClient = new ScannedDocumentsClient(mockClient)
  const bearerToken = 'IUgiYGOFUHSODFIUGHPASIYYUGLIYFGKUTF&TF'
  const externalId = 'b17af4d2-273f-4999-9895-bce382fa24c8'
  const documentType = 'FORM'
  const documentSubtype = 'OCON9X'

  const expectedPayload = {
    url: 'http://localhost/scanneddoc'
  }

  nock(mockClient)
  .get(/\/scanned-documents\/.+/)
  .reply(200, expectedPayload)

  chai.use(chaiAsPromised)

  it('should should retrieve the Ocon9x scanned response form for a case', () => {
    chai.expect(client.getScannedResponseFormPDF(externalId, bearerToken)).to.not.be.undefined
  })

  it('should should retrieve the scanned response form for a case', () => {
    chai.expect(client.getScannedPDF(externalId, documentType, documentSubtype, bearerToken)).to.not.be.undefined
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

  it('should throw error when given undefined documentType', () => {
    chai.expect(() => client.getScannedPDF(externalId, undefined, documentSubtype, bearerToken))
      .to.throw(Error, 'Document type cannot be blank')
  })

  it('should throw error when not given an empty documentType', () => {
    chai.expect(() => client.getScannedPDF(externalId, '', documentSubtype, bearerToken))
      .to.throw(Error, 'Document type cannot be blank')
  })

  it('should throw error when not given undefined documentSubtype', () => {
    chai.expect(() => client.getScannedPDF(externalId, documentType, undefined, bearerToken))
      .to.throw(Error, 'Document subtype cannot be blank')
  })

  it('should throw error when not given an empty documentSubtype', () => {
    chai.expect(() => client.getScannedPDF(externalId, documentType, '', bearerToken))
      .to.throw(Error, 'Document subtype cannot be blank')
  })
})
