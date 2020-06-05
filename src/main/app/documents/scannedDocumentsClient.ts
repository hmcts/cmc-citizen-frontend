import * as config from 'config'
import { request } from 'client/request'
import { StringUtils } from 'utils/stringUtils'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class ScannedDocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/scanned-documents`) {
  }

  public getScannedResponseFormPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'OCON9x', bearerToken)
  }

  private getPDF (claimExternalId: string, documentTemplate: string, bearerToken: string): Promise<Buffer> {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    if (StringUtils.isBlank(documentTemplate)) {
      throw new Error('Document template cannot be blank')
    }
    if (StringUtils.isBlank(bearerToken)) {
      throw new Error('User authorisation cannot be blank')
    }

    const options = {
      uri: `${this.documentsUrl}/${claimExternalId}/${documentTemplate}`,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: 'application/pdf'
      },
      encoding: null
    }

    return request(options).then(function (response) {
      return response
    })
  }
}
