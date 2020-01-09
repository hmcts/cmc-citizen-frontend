import I = CodeceptJS.I

const I: I = actor()

export class DefendantSettlementAgreementRepaymentPlanSummary {

  verifyRepaymentPlanSummary (): void {
    I.see('The claimant’s repayment plan')
  }

  respondeToSettlementAgreement (): void {
    I.click('Respond to settlement agreement')
  }
}
