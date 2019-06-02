import { Address } from './address'

export class Court {
  constructor (
    public readonly name: string,
    public readonly slug: string,
    public readonly address: Address
  ) {
  }
}
