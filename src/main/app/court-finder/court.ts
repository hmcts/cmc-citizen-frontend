import { Address } from './address'
import { AreaOfLaw } from './areaOfLaw'

export class Court {
  constructor (
    public readonly name: string,
    public readonly lat: number,
    public readonly lon: number,
    public readonly courtNumber: number,
    public readonly cciCode: number,
    public readonly magistrateCode: number,
    public readonly slug: string,
    public readonly types: string[],
    public readonly dxNumber: string,
    public readonly distance: number,
    public readonly address: Address,
    public readonly areasOfLaw: AreaOfLaw[]
  ) {
  }
}
