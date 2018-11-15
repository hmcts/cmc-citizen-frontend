import I = CodeceptJS.I

const I: I = actor()

export class ClaimantTaskListPage {

  selectTaskViewDefendantResponse (): void {
    I.click('View the defendant’s response')
  }

  selectTaskAcceptOrRejectPartAdmit (): void {
    I.click('Accept or reject')
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

  selectTaskRequestCountyCourtJudgment (): void {
    I.click('Request a County Court Judgment')
  }

  selectProposeAnAlternativeRepaymentPlan (): void {
    I.click('Propose an alternative repayment plan')
  }

}
