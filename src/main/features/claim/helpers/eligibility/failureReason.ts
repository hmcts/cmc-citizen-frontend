export class FailureReason {
  private static readonly claimValue: FailureReason = new FailureReason(
    'claim-value',
    'Claims including any interest must be under £10,000.'
  )
  private static readonly claimantAddress: FailureReason = new FailureReason(
    'claimant-address',
    'You must live in the UK to issue a money claim.'
  )
  private static readonly defendantAddress: FailureReason = new FailureReason(
    'defendant-address',
    'You can only make a claim against an person or organisation within England or Wales.'
  )
  private static readonly over18: FailureReason = new FailureReason(
    'over-18',
    'You must be 18 or over to use the service.'
  )
  private static readonly governmentDepartment: FailureReason = new FailureReason(
    'government-department',
    'You can’t make a claim against a government department - eg HM Revenue and Customs.'
  )

  constructor (private readonly code: string, public readonly displayValue: string) {
  }

  static lookup (code: string): string {
    const failureReasons = this.all().filter((needle) => needle.code === code)
    if (failureReasons.length === 1) {
      return failureReasons.pop().displayValue
    }

    throw new Error('Couldn’t find a failure reason')
  }

  private static all (): FailureReason[] {
    return [
      FailureReason.claimValue,
      FailureReason.claimantAddress,
      FailureReason.defendantAddress,
      FailureReason.over18,
      FailureReason.governmentDepartment
    ]
  }
}
