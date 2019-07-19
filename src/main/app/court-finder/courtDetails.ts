import { Facilities } from 'court-finder-client/facilities'

export class CourtDetails {
  constructor (
    public readonly name: string,
    public readonly slug: string,
    public readonly facilities: Facilities[]
  ) {}
}
