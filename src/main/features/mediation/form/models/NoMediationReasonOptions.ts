export class NoMediationReasonOptions {
  static readonly ALREADY_TRIED = 'I have already tried to resolve the dispute with the other party, with no success'
  static readonly NOT_SURE = 'I am not sure what would happen in mediation'
  static readonly WOULD_NOT_SOLVE = 'I do not think mediation would solve the dispute'
  static readonly NO_DELAY_IN_HEARING = 'I do not want to delay getting a hearing'
  static readonly JUDGE_TO_DECIDE = 'I want a judge to make a decision on the dispute'
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
