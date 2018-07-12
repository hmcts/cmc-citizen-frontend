import I = CodeceptJS.I

const I: I = actor()

export class DefendantTaskListPage {

  selectTaskConfirmYourDetails (): void {
    I.click('Confirm your details')
  }

  selectTaskMoreTimeNeededToRespond (): void {
    I.click('Do you want more time to respond?')
  }

  selectChooseAResponse (): void {
    I.click('Choose a response')
  }

  selectTaskHaveYouPaidTheClaimantTheAmountYouAdmitYouOwe (): void {
    I.click('Have you paid the claimant the amount you admit you owe?')
  }

  selectTaskHowMuchPaidToClaiment (): void {
    I.click('How much have you paid the claimant?')
  }

  selectTaskHowMuchMoneyBelieveYouOwe (): void {
    I.click('How much money do you believe you owe?')
  }

  selectTaskDecideHowWillYouPay (): void {
    I.click('Decide how you`ll pay')
  }

  selectTaskWhenDidYouPay (): void {
    I.click('When did you pay?')
  }

  selectTaskWhyDoYouDisagreeWithTheClaim (): void {
    I.click('Why do you disagree with the claim?')
  }

  selectYourRepaymentPlanTask (): void {
    I.click('Your repayment plan')
  }

  selectShareYourFinancialDetailsTask (): void {
    I.click('Share your financial details')
  }

  selectTaskCheckAndSendYourResponse (): void {
    I.click('Check and submit your response')
  }

  selectTaskFreeMediation (): void {
    I.click('Free mediation')
  }

}
