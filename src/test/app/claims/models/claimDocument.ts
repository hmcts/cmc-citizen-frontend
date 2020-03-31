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

const claimDocument = new ClaimDocument()

describe('ClaimDocument', () => {

  it('should return document display name', () => {
    const actual: ClaimDocument = claimDocument.deserialize(claimDocumentSample)

    expect(actual.documentDisplayName).to.be.eq('Download the sealed claim')
  })

  it('should return text', () => {
    const actual: string = claimDocument.getDisplayName('CLAIMANT_DIRECTIONS_QUESTIONNAIRE')

    expect(actual).to.be.eq('Download your hearing requirements')
  })

  it('should return uri', () => {
    const actual: string = claimDocument.getDocumentURI('CLAIMANT_DIRECTIONS_QUESTIONNAIRE')

    expect(actual).to.be.eq('claimant-directions-questionnaire')
  })

})
