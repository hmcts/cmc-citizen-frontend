export class InterestDateType {
  static readonly CUSTOM: string = 'custom'
  static readonly SUBMISSION: string = 'submission'

  static all (): string[] {
    return [
      InterestDateType.CUSTOM,
      InterestDateType.SUBMISSION
    ]
  }
}
