import { DefendantTaskListPage } from 'integration-test/tests/citizen/defence/pages/defendant-task-list'

const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()

export class DefendantSteps {

  selectTaskConfirmYourDetails (): void {
    defendantTaskListPage.selectTaskConfirmYourDetails()
  }

  selectTaskMoreTimeNeededToRespond (): void {
    defendantTaskListPage.selectTaskMoreTimeNeededToRespond()
  }

  selectTaskChooseAResponse (): void {
    defendantTaskListPage.selectChooseAResponse()
  }

  selectTaskHaveYouPaidClaimant (): void {
    defendantTaskListPage.selectTaskHaveYouPaidTheClaimantTheAmountYouAdmitYouOwe()
  }

  selectTaskHowMuchMoneyBelieveYouOwe (): void {
    defendantTaskListPage.selectTaskHowMuchMoneyBelieveYouOwe()
  }

  selectTaskDecideHowWillYouPay (): void {
    defendantTaskListPage.selectTaskDecideHowWillYouPay()
  }

  selectTaskWhenDidYouPay (): void {
    defendantTaskListPage.selectTaskWhenDidYouPay()
  }

  selectTaskHowMuchPaidToClaiment (): void {
    defendantTaskListPage.selectTaskHowMuchPaidToClaiment()
  }

  selectTaskWhyDoYouDisagreeWithTheClaim (): void {
    defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheClaim()
  }

  selectCheckAndSubmitYourDefence (): void {
    defendantTaskListPage.selectTaskCheckAndSendYourResponse()
  }

  selectTaskFreeMediation (): void {
    defendantTaskListPage.selectTaskFreeMediation()
  }

}
