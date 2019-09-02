import { SupportRequiredPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/support-required'
import { HearingDatesPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/hearing-dates'
import { HearingLocationPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/hearing-location'
import { UsingExpertPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/using-expert'
import { ExpertReportsPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/expert-reports'
import { SelfWitnessPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/self-witness'
import { OtherWitnessPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/other-wtiness'
import { HearingExceptionalCircumstancesPage } from 'integration-test/tests/citizen/directionsQuestionnaire/pages/hearing-exceptional-circumstances'
import { PartyType } from 'integration-test/data/party-type'

const supportRequiredPage: SupportRequiredPage = new SupportRequiredPage()
const hearingLocationPage: HearingLocationPage = new HearingLocationPage()
const hearingExceptionalCircumstancesPage: HearingExceptionalCircumstancesPage = new HearingExceptionalCircumstancesPage()
const usingExpertPage: UsingExpertPage = new UsingExpertPage()
const expertReportsPage: ExpertReportsPage = new ExpertReportsPage()
const selfWitnessPage: SelfWitnessPage = new SelfWitnessPage()
const otherWitnessPage: OtherWitnessPage = new OtherWitnessPage()
const hearingDatesPage: HearingDatesPage = new HearingDatesPage()

export class DirectionsQuestionnaireSteps {
  acceptDirectionsQuestionnaireYesJourney (defendantType: PartyType = PartyType.INDIVIDUAL): void {
    if (process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
      supportRequiredPage.selectAll()
      if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
        hearingExceptionalCircumstancesPage.chooseYes()
      }
      hearingLocationPage.chooseYes()
      usingExpertPage.chooseExpertYes()
      expertReportsPage.chooseYes('I am an expert, trust me',
        '2019-01-01')
      selfWitnessPage.chooseYes()
      otherWitnessPage.chooseYes()
      hearingDatesPage.chooseYes()
    }
  }

  acceptDirectionsQuestionnaireNoJourney (defendantType: PartyType = PartyType.INDIVIDUAL): void {
    if (process.env.FEATURE_DIRECTIONS_QUESTIONNAIRE === 'true') {
      supportRequiredPage.selectAll()
      if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
        hearingExceptionalCircumstancesPage.chooseNo()
      }
      hearingLocationPage.chooseNo()
      usingExpertPage.chooseExpertNo()
      selfWitnessPage.chooseNo()
      otherWitnessPage.chooseNo()
      hearingDatesPage.chooseNo()
    }
  }
}
