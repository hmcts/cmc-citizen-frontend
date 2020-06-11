import { Address } from './address'
import { CourtFinderClient } from 'court-finder-client/courtFinderClient'
import { CourtFinderResponse } from 'court-finder-client/courtFinderResponse'
import { CourtDetails } from 'court-finder-client/courtDetails'
import { CourtDetailsResponse } from 'court-finder-client/courtDetailsResponse'

export class Court {
  constructor (
    public readonly name: string,
    public readonly slug: string,
    public readonly address: Address
  ) {
  }

  static async getNearestCourt (postcode: string): Promise<Court> {
    const courtFinderClient: CourtFinderClient = new CourtFinderClient()
    const response: CourtFinderResponse = await courtFinderClient.findMoneyClaimCourtsByPostcode(postcode)

    if (response.statusCode !== 200 || response.courts.length === 0) {
      return undefined
    } else {
      return response.courts[0]
    }
  }

  static async getCourtsByName (name: string): Promise<Court[]> {
    const courtFinderClient: CourtFinderClient = new CourtFinderClient()
    const response: CourtFinderResponse = await courtFinderClient.findMoneyClaimCourtsByName(name)

    if (response.statusCode !== 200 || response.courts.length === 0) {
      return undefined
    } else {
      return response.courts
    }
  }

  static async getCourtDetails (slug: string): Promise<CourtDetails> {
    const courtFinderClient: CourtFinderClient = new CourtFinderClient()
    const courtDetailsResponse: CourtDetailsResponse = await courtFinderClient.getCourtDetails(slug)

    return courtDetailsResponse.courtDetails
  }
}
