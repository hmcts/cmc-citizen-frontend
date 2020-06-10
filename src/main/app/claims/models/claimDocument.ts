import { MomentFactory } from 'shared/momentFactory'
import { Moment } from 'moment'
import { ClaimDocumentType } from 'common/claimDocumentType'

export class ClaimDocument {
  id: string
  documentManagementUrl: string
  documentManagementBinaryUrl: string
  documentName: string
  documentType: string
  uri: string
  documentDisplayName: string
  createdDatetime: Moment
  createdBy: string
  size: string

  deserialize (input: any): ClaimDocument {
    if (input) {
      this.id = input.id
      this.documentManagementUrl = input.documentManagementUrl
      this.documentManagementBinaryUrl = input.documentManagementBinaryUrl
      this.documentName = input.documentName.replace('.pdf','')
      this.documentType = input.documentType
      this.uri = this.getDocumentURI(input.documentType)
      this.documentDisplayName = this.getDisplayName(input.documentType)
      this.createdDatetime = MomentFactory.parse(input.createdDatetime)
      this.createdBy = input.createdBy
      this.size = input.size
    }

    return this
  }

  getDisplayName (documentType: string): string {

    return ClaimDocumentType[documentType].text
  }

  getDocumentURI (documentType: string): string {
    return ClaimDocumentType[documentType].uri
  }
}
