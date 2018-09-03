export class CourtOrder {

  constructor (
    public readonly defendantMonthlyInstalment: number,
    public readonly claimantMonthlyInstalment: number,
    public readonly defendantMonthlyDisposableIncome: number) {
  }

  calculateAmount (): number {
    if (this.defendantMonthlyInstalment >= this.defendantMonthlyDisposableIncome) {
      return this.defendantMonthlyInstalment
    }

    if (this.claimantMonthlyInstalment <= this.defendantMonthlyDisposableIncome) {
      return this.claimantMonthlyInstalment
    }

    return this.defendantMonthlyDisposableIncome
  }
}
