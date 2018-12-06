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

  selectTaskHowMuchHaveYouPaid (): void {
    defendantTaskListPage.selectTaskHowMuchHaveYouPaid()
  }

  selectTaskTellUsHowMuchYouHavePaid (): void {
    defendantTaskListPage.selectTaskTellUsHowMuchYouHavePaid()
  }

  selectTaskWhyDoYouDisagreeWithTheClaim (): void {
    defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheClaim()
  }

  selectTaskWhyDoYouDisagreeWithTheAmountClaimed (): void {
    defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
  }

  selectCheckAndSubmitYourDefence (): void {
    defendantTaskListPage.selectTaskCheckAndSendYourResponse()
  }

  selectTaskFreeMediation (): void {
    defendantTaskListPage.selectTaskFreeMediation()
  }

  selectTaskWhenYouWillPay (): void {
    defendantTaskListPage.selectTaskWhenWillYouPay()
  }

}
