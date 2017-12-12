import * as config from 'config'
import { requestNonPromise } from 'app/client/request'
import * as http from 'http'
import { StringUtils } from 'app/utils/stringUtils'

const claimStoreBaseUrl = config.get<string>('claim-store.url')

export class DocumentsClient {

  constructor (public documentsUrl: string = `${claimStoreBaseUrl}/documents`) {
  }
  getPDF (claimExternalId: string, documentTemplate: string): http.IncomingMessage {
    if (StringUtils.isBlank(claimExternalId)) {
      throw new Error('Claim external ID cannot be blank')
    }
    if (StringUtils.isBlank(documentTemplate)) {
      throw new Error('Document template cannot be blank')
    }
    return requestNonPromise.get({
      uri: `${this.documentsUrl}/${documentTemplate}/${claimExternalId}`
    })
  }

}
