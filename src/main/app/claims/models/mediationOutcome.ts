export class MediationOutcome {
  static readonly SUCCEEDED = 'SUCCEEDED'
  static readonly FAILED = 'FAILED'

  static all (): string[] {
    return [
      MediationOutcome.SUCCEEDED,
      MediationOutcome.FAILED
    ]
  }
}
