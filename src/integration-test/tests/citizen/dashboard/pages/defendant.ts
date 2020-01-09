import I = CodeceptJS.I

const I: I = actor()

export class DefendantDashboardPage {

  verifyPartAdmitRejectStatus (claimantName: string, amount: number): void {
    I.see(`${ claimantName } has rejected your admission of £${ Number(amount).toLocaleString() }`)
  }

  verifySettlementAggrement (claimantName: string): void {
    I.see(`${ claimantName } asked you to sign a settlement agreement`)
  }

  clickViewTheRepaymentPlane (): void {
    I.click('View the repayment plan')
  }

  verifyCCJRequestStatus (claimantName: string): void {
    I.see(`${claimantName} requested a County Court Judgment (CCJ) against you`)
  }

  verifyCourtDeterminationRepaymentPlan (claimantName: string): void {
    I.see(`${claimantName} rejected your repayment plan.`)
    I.see('They accepted a new repayment plan determined by the court, based on the financial details you provided.')
    I.see('They asked you to sign a settlement agreement to formalise the plan.')
  }
}
