import { Address } from './address'
import { Facilities } from './facilities'

export class Court {
  constructor (
    public readonly name: string,
    public readonly slug: string,
    public readonly address: Address,
    public readonly facilities: Facilities[]
  ) {
  }
}
