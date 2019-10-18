import { CourtDetails } from 'court-finder-client/courtDetails'

export class CourtDetailsResponse {
  public courtDetails: CourtDetails

  constructor (
    public readonly statusCode: number,
    public readonly valid: boolean
  ) {}
}
