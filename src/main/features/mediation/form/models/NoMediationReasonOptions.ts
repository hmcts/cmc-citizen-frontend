export class NoMediationReasonOptions {
  static readonly ALREADY_TRIED = 'alreadyTried'
  static readonly NOT_SURE = 'notSure'
  static readonly WOULD_NOT_SOLVE = 'wouldNotSolve'
  static readonly NO_DELAY_IN_HEARING = 'noDelayInHearing'
  static readonly JUDGE_TO_DECIDE = 'judgeToDecide'
  static readonly OTHER = 'other'

  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static all (): string[] {
    return [
      NoMediationReasonOptions.ALREADY_TRIED,
      NoMediationReasonOptions.NOT_SURE,
      NoMediationReasonOptions.WOULD_NOT_SOLVE,
      NoMediationReasonOptions.NO_DELAY_IN_HEARING,
      NoMediationReasonOptions.JUDGE_TO_DECIDE,
      NoMediationReasonOptions.OTHER
    ]
  }
}
