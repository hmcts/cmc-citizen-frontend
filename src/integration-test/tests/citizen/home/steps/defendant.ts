import { DefendantTaskListPage } from 'integration-test/tests/citizen/defence/pages/defendant-task-list'
import { MediationSteps } from 'integration-test/tests/citizen/mediation/steps/mediation'
import { EnhancedMediationSteps } from 'integration-test/tests/citizen/mediation/steps/enhancedMediation'
import { PartyType } from 'integration-test/data/party-type'
import { DirectionsQuestionnaireSteps } from 'integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps'
import I = CodeceptJS.I

const I: I = actor()
const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()
const mediationSteps: MediationSteps = new MediationSteps()
const enhancedMediationSteps: EnhancedMediationSteps = new EnhancedMediationSteps()
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

  async selectTaskFreeMediation (I: I, defendantType: PartyType): Promise<void> {
    defendantTaskListPage.selectTaskFreeMediation()
    const isEnhacedMediationJourneyEnabled = await I.checkEnhancedMediationJourney()
    if (isEnhacedMediationJourneyEnabled) {
      I.see('Continue')
      if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
        enhancedMediationSteps.acceptEnhancedMediationAsCompanyPhoneNumberProvided()
      } else {
        enhancedMediationSteps.acceptEnhancedMediationAsIndividualPhoneNumberProvidedIsUsed()
      }
    } else {
      I.see('How free mediaiton works')
      if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
        mediationSteps.acceptMediationAsCompanyPhoneNumberProvided()
      } else {
        mediationSteps.acceptMediationAsIndividualPhoneNumberProvidedIsUsed()
      }
    }
  }

  async selectTaskHearingRequirements (defendantType: PartyType): Promise<void> {
    defendantTaskListPage.selectTaskHearingRequirements()
    await directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney(defendantType)
  }

  selectTaskWhenYouWillPay (): void {
    defendantTaskListPage.selectTaskWhenWillYouPay()
  }

}
