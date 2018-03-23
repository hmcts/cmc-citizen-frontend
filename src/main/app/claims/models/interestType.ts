export class InterestType {
  static readonly STANDARD = 'standard'
  static readonly DIFFERENT = 'different'
  static readonly NO_INTEREST: string = 'no interest'
  static readonly BREAKDOWN: string = 'breakdown'

  static all (): string[] {
    return [
      InterestType.STANDARD,
      InterestType.DIFFERENT,
      InterestType.NO_INTEREST,
      InterestType.BREAKDOWN
    ]
  }
}
