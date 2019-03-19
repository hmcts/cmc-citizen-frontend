import { Address } from './address'

export class Court {
  constructor (
    public readonly name: string,
    public readonly distance: number,
    public readonly address: Address
  ) {
  }
}
