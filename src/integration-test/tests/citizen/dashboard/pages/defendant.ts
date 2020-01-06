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
}
