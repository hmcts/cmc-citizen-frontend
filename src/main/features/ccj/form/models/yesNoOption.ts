export class PaidAmountOption {
  static readonly YES = new PaidAmountOption('yes')
  static readonly NO = new PaidAmountOption('no')

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): PaidAmountOption[] {
    return [
      PaidAmountOption.YES,
      PaidAmountOption.NO
    ]
  }
}
