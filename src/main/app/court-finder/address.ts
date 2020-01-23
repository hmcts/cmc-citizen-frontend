export class Address {
  constructor (
    public readonly addressLines: string[],
    public readonly postcode: string,
    public readonly town: string,
    public readonly type: string
  ) {
  }
}
