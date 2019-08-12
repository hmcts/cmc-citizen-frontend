import { DefendantTaskListPage } from 'integration-test/tests/citizen/defence/pages/defendant-task-list'
import { MediationSteps } from 'integration-test/tests/citizen/mediation/steps/mediation'

const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()
const mediationSteps: MediationSteps = new MediationSteps()

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
    mediationSteps.acceptMediationAsIndividualPhoneNumberProvidedIsUsed()
  }

  selectTaskWhenYouWillPay (): void {
    defendantTaskListPage.selectTaskWhenWillYouPay()
  }

}
