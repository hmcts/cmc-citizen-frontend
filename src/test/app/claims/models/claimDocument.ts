import { expect } from 'chai'
import { ClaimDocument } from 'claims/models/claimDocument'

const claimDocumentSample = {
  id: '3f1813ee-5b60-43fd-9160-fa92605dfd6e',
  documentName: '000MC258-claim-form.pdf',
  documentType: 'SEALED_CLAIM',
  createdDatetime: '2020-02-26T14:56:49.264',
  createdBy: 'OCMC',
  size: 79777
}

const scannedDocumentSample = {
  id: '3f1813ee-5b60-43fd-9160-fa92605dfd6e',
  fileName: '000MC258-ocon9x-form.pdf',
  documentType: 'FORM',
  subtype: 'OCON9x',
  deliveryDate: '2020-02-26T14:56:49.264',
  documentManagementUrl: 'http://localhost',
  documentManagementBinaryUrl: 'http://localhost'
}

const claimDocument = new ClaimDocument()

describe('ClaimDocument', () => {

  it('should return document display name', () => {
    const actual: ClaimDocument = claimDocument.deserialize(claimDocumentSample)
    expect(actual.documentDisplayName).to.be.eq('Download claim')
  })

  it('should return text', () => {
    const actual: string = claimDocument.getDisplayName('CLAIMANT_DIRECTIONS_QUESTIONNAIRE')
    expect(actual).to.be.eq('Download the claimant\'s hearing requirements')
  })

  it('should return uri', () => {
    const actual: string = claimDocument.getDocumentURI('CLAIMANT_DIRECTIONS_QUESTIONNAIRE', claimDocumentSample.id)
    expect(actual).to.be.eq('claimant-directions-questionnaire')
  })

  it('should return uri with id for General letters', () => {
    const actual: string = claimDocument.getDocumentURI('GENERAL_LETTER', claimDocumentSample.id)
    expect(actual).to.be.eq('GENERAL_LETTER:3f1813ee-5b60-43fd-9160-fa92605dfd6e')
  })

})

describe('ScannedDocument', () => {
  it('should return Claim document with values mapped from Scanned document', () => {
    const actual: ClaimDocument = claimDocument.deserializeScannedDocument(scannedDocumentSample)
    expect(actual.documentDisplayName).to.be.eq("Download the defendant's response")
    expect(actual.documentManagementUrl).to.be.eq('http://localhost')
    expect(actual.uri).to.be.eq('form-ocon9x')
    expect(actual.documentName).to.be.eq('000MC258-ocon9x-form')
  })
})
