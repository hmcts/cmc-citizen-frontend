import { DefendantTaskListPage } from 'integration-test/tests/citizen/defence/pages/defendant-task-list'
import { MediationSteps } from 'integration-test/tests/citizen/mediation/steps/mediation'
import { PartyType } from 'integration-test/data/party-type'
import { DirectionsQuestionnaireSteps } from 'integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps'

const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()
const mediationSteps: MediationSteps = new MediationSteps()
const directionsQuestionnaireSteps: DirectionsQuestionnaireSteps = new DirectionsQuestionnaireSteps()

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

  selectTaskFreeMediation (defendantType: PartyType): void {
    defendantTaskListPage.selectTaskFreeMediation()
    if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
      mediationSteps.acceptMediationAsCompanyPhoneNumberProvided()
    } else {
      mediationSteps.acceptMediationAsIndividualPhoneNumberProvidedIsUsed()
    }
  }

  selectTaskHearingRequirements (defendantType: PartyType): void {
    defendantTaskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney(defendantType)
  }

  selectTaskWhenYouWillPay (): void {
    defendantTaskListPage.selectTaskWhenWillYouPay()
  }

}
