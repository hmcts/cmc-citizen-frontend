import I = CodeceptJS.I

const I: I = actor()

export class DefendantTaskListPage {

  selectTaskConfirmYourDetails (): void {
    this.clickText('Confirm your details')
  }

  selectTaskMoreTimeNeededToRespond (): void {
    this.clickText('Decide if you need more time to respond')
  }

  selectChooseAResponse (): void {
    this.clickText('Choose a response')
  }

  selectTaskHowMuchPaidToClaiment (): void {
    this.clickText('How much have you paid the claimant?')
  }

  selectTaskHowMuchHaveYouPaid (): void {
    this.clickText('How much have you paid?')
  }

  selectTaskTellUsHowMuchYouHavePaid (): void {
    this.clickText('Tell us how much you’ve paid')
  }

  selectTaskHowMuchMoneyBelieveYouOwe (): void {
    this.clickText('How much money do you admit you owe?')
  }

  selectTaskDecideHowWillYouPay (): void {
    this.clickText('Decide how you’ll pay')
  }

  selectTaskWhenDidYouPay (): void {
    this.clickText('When did you pay?')
  }

  selectTaskWhyDoYouDisagreeWithTheClaim (): void {
    this.clickText('Tell us why you disagree with the claim')
  }

  selectTaskWhyDoYouDisagreeWithTheAmountClaimed (): void {
    this.clickText('Why do you disagree with the amount claimed?')
  }

  selectTaskWhenWillYouPay (): void {
    this.clickText('When will you pay')
  }

  selectYourRepaymentPlanTask (): void {
    this.clickText('Your repayment plan')
  }

  selectShareYourFinancialDetailsTask (): void {
    this.clickText('Share your financial details')
  }

  selectTaskCheckAndSendYourResponse (): void {
    this.clickText('Check and submit your response')
  }

  selectTaskFreeMediation (): void {
    this.clickText('Free telephone mediation')
  }

  selectTaskHearingRequirements (): void {
    this.clickText('Give us details in case there’s a hearing')
  }

  private clickText (text: string) {
    I.waitForText(text)
    I.click(text)
  }
}
