/* Allow chai assertions which don't end in a function call, e.g. expect(thing).to.be.undefined */
/* tslint:disable:no-unused-expression */

import * as nock from 'nock'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

import { ScannedDocumentsClient } from 'documents/scannedDocumentsClient'
import * as idamServiceMock from 'test/http-mocks/idam'

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

  beforeEach(() => {
    idamServiceMock.resolveRetrieveServiceToken()
    nock(mockClient)
      .get(/\/scanned-documents\/.+/)
      .reply(200, expectedPayload)
  })

  chai.use(chaiAsPromised)

  it('should should retrieve the Ocon9x scanned response form for a case', () => {
    chai.expect(client.getScannedResponseFormPDF(externalId, bearerToken)).to.not.be.undefined
  })

  it('should should retrieve the scanned response form for a case', () => {
    chai.expect(client.getScannedPDF(externalId, documentType, documentSubtype, bearerToken)).to.not.be.undefined
  })

  it('should throw error when given undefined ExternalId', async () => {
    try {
      await client.getScannedResponseFormPDF(undefined, bearerToken)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('Claim external ID cannot be blank')
    }
  })

  it('should throw error when given empty ExternalId', async () => {
    try {
      await client.getScannedResponseFormPDF('', bearerToken)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('Claim external ID cannot be blank')
    }
  })

  it('should throw error when not given undefined bearerToken', async () => {
    try {
      await client.getScannedResponseFormPDF(externalId, undefined)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('User authorisation cannot be blank')
    }
  })

  it('should throw error when not given an empty bearerToken', async () => {
    try {
      await client.getScannedResponseFormPDF(externalId, '')
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('User authorisation cannot be blank')
    }
  })

  it('should throw error when given undefined documentType', async () => {
    try {
      await client.getScannedPDF(externalId, undefined, documentSubtype, bearerToken)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('Document type cannot be blank')
    }
  })

  it('should throw error when not given an empty documentType', async () => {
    try {
      await client.getScannedPDF(externalId, '', documentSubtype, bearerToken)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('Document type cannot be blank')
    }
  })

  it('should throw error when not given undefined documentSubtype', async () => {
    try {
      await client.getScannedPDF(externalId, documentType, undefined, bearerToken)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('Document subtype cannot be blank')
    }
  })

  it('should throw error when not given an empty documentSubtype', async () => {
    try {
      await client.getScannedPDF(externalId, documentType, '', bearerToken)
      chai.assert.fail('Should have thrown error')
    } catch (err) {
      chai.expect(err.message).to.equal('Document subtype cannot be blank')
    }
  })
})
