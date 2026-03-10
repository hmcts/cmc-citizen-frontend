import * as config from 'config'
import { StringUtils } from 'utils/stringUtils'
import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { ServiceAuthTokenFactoryImpl } from 'shared/security/serviceTokenFactoryImpl'

const claimStoreBaseUrl = config.get<string>('claim-store.url')
const serviceAuthTokenFactory = new ServiceAuthTokenFactoryImpl()

export class ScannedDocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/scanned-documents`,
               private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
                 requestPromise.RequestPromiseOptions,
                 requestDefault.RequiredUriUrl> = requestPromise) {
  }

  public getScannedResponseFormPDF (claimExternalId: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, 'FORM', 'OCON9X', bearerToken)
  }

  public getScannedPDF (claimExternalId: string, documentType: string, documentSubtype: string, bearerToken: string): Promise<Buffer> {
    return this.getPDF(claimExternalId, documentType, documentSubtype, bearerToken)
  }

  private async getPDF (claimExternalId: string, documentType: string, documentSubtype: string, bearerToken: string): Promise<Buffer> {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    if (StringUtils.isBlank(documentType)) {
      throw new Error('Document type cannot be blank')
    }
    if (StringUtils.isBlank(documentSubtype)) {
      throw new Error('Document subtype cannot be blank')
    }
    if (StringUtils.isBlank(bearerToken)) {
      throw new Error('User authorisation cannot be blank')
    }

    const serviceAuthToken = await serviceAuthTokenFactory.get()
    const options = {
      uri: `${this.documentsUrl}/${claimExternalId}/${documentType}/${documentSubtype}`,
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        ServiceAuthorization: `Bearer ${serviceAuthToken.bearerToken}`,
        Accept: 'application/pdf'
      },
      encoding: null
    }

    return this.request(options)
  }
}
