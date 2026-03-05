import { request } from 'client/request'

const OS_PLACES_BASE_URL = 'https://api.os.uk/search/places/v1'

export interface AddressInfo {
  formattedAddress: string
  postcode: string
}

export interface AddressInfoResponse {
  addresses: AddressInfo[]
  isValid: boolean
}

interface OSPlacesResultItem {
  DPA?: { ADDRESS?: string; POSTCODE?: string }
  LPI?: { ADDRESS?: string; POSTCODE_LOCATOR?: string }
}

interface OSPlacesApiResponse {
  header?: { totalresults?: number }
  results?: OSPlacesResultItem[]
}

function mapResultToAddress (item: OSPlacesResultItem): AddressInfo {
  const dpa = item.DPA
  const lpi = item.LPI
  const formattedAddress = dpa?.ADDRESS ?? lpi?.ADDRESS ?? ''
  const postcode = dpa?.POSTCODE ?? lpi?.POSTCODE_LOCATOR ?? ''
  return { formattedAddress, postcode }
}

export class OsPlacesClient {
  constructor (
    private readonly apiKey: string,
    private readonly httpClient: { get: (opts: { uri: string }) => Promise<{ body?: OSPlacesApiResponse; statusCode: number }> } = request
  ) {}

  async lookupByPostcodeAndDataSet (postcode: string, dataset: string): Promise<AddressInfoResponse> {
    const encodedPostcode = encodeURIComponent(postcode.trim())
    const uri = `${OS_PLACES_BASE_URL}/postcode?postcode=${encodedPostcode}&dataset=${dataset}&key=${this.apiKey}`

    try {
      const response = await this.httpClient.get({
        uri,
        resolveWithFullResponse: true,
        simple: false
      })

      if (response.statusCode === 401) {
        throw new Error('Authentication failed')
      }

      if (response.statusCode !== 200 || !response.body) {
        return { addresses: [], isValid: false }
      }

      const data = response.body as OSPlacesApiResponse
      const results = data?.results ?? []
      const totalResults = data?.header?.totalresults ?? 0

      const addresses = results.map(mapResultToAddress).filter(a => a.formattedAddress || a.postcode)

      return {
        addresses,
        isValid: totalResults > 0 && addresses.length > 0
      }
    } catch (err: any) {
      if (err?.message === 'Authentication failed') throw err
      return { addresses: [], isValid: false }
    }
  }
}
