import I = CodeceptJS.I

const I: I = actor()

export class ClaimantTaskListPage {

  selectTaskViewDefendantResponse (): void {
    I.click('View the defendant’s response')
  }

  selectTaskAcceptOrRejectPartAdmit (): void {
    I.click('Accept or reject')
  }

  selectTaskAcceptOrRejectSpecificAmount (amount: number): void {
    I.click(`Accept or reject the £${Number(amount).toLocaleString()}`)
  }

  selectTaskAcceptOrRejectTheirRepaymentPlan (): void {
    I.click('Accept or reject their repayment plan')
  }

  selectTaskChooseHowToFormaliseRepayment (): void {
    I.click('Choose how to formalise repayment')
  }

  selectTaskSignASettlementAgreement (): void {
    I.click('Sign a settlement agreement')
  }

  selectTaskCheckandSubmitYourResponse (): void {
    I.click('Check and submit your response')
  }

  selectTaskFreeMediation (): void {
    I.click('Free telephone mediation')
  }

  selectTaskHearingRequirements (): void {
    I.click('Give us details in case there’s a hearing')
  }

  selectTaskRequestCountyCourtJudgment (): void {
    I.click('Request a County Court Judgment')
  }

  selectProposeAnAlternativeRepaymentPlan (): void {
    I.click('Propose an alternative repayment plan')
  }

}
