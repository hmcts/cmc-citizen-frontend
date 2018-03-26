export class InterestRateOption {
  static readonly STANDARD: string = 'standard'
  static readonly DIFFERENT: string = 'different'

  static all (): string[] {
    return [
      InterestRateOption.STANDARD,
      InterestRateOption.DIFFERENT
    ]
  }
}
