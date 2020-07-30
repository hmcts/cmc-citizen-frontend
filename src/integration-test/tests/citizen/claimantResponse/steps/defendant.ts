import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { DefendantSteps } from 'integration-test/tests/citizen/home/steps/defendant'
import { createClaimant, createDefendant } from 'integration-test/data/test-data'
import { DefendantTimelineEventsPage } from 'integration-test/tests/citizen/defence/pages/defendant-timeline-events'
import { DefendantEvidencePage } from 'integration-test/tests/citizen/defence/pages/defendant-evidence'
import { DefendantHowMuchHaveYouPaidPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid'
import { DefendantYouHavePaidLessPage } from 'integration-test/tests/citizen/defence/pages/defendant-you-have-paid-less'
import { DefendantWhyDoYouDisagreePage } from 'integration-test/tests/citizen/defence/pages/defendant-why-do-you-disagree'
import { ClaimantResponseTestData } from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { MediationSteps } from 'integration-test/tests/citizen/mediation/steps/mediation'
import { DefendantTaskListPage } from 'integration-test/tests/citizen/defence/pages/defendant-task-list'
import { DirectionsQuestionnaireSteps } from 'integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps'

const I: I = actor()
const defendantSteps: DefendantSteps = new DefendantSteps()
const defenceSteps: DefenceSteps = new DefenceSteps()
const timelineEventsPage: DefendantTimelineEventsPage = new DefendantTimelineEventsPage()
const evidencePage: DefendantEvidencePage = new DefendantEvidencePage()
const howMuchHaveYouPaidPage: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const youHavePaidLessPage: DefendantYouHavePaidLessPage = new DefendantYouHavePaidLessPage()
const whyYouDisagreePage: DefendantWhyDoYouDisagreePage = new DefendantWhyDoYouDisagreePage()
const mediationSteps: MediationSteps = new MediationSteps()
const directionsQuestionnaireSteps: DirectionsQuestionnaireSteps = new DirectionsQuestionnaireSteps()
const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()

export class DefendantResponseSteps {

  disputeAllClaim (testData: EndToEndTestData, claimantResponseTestData: ClaimantResponseTestData): void {
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    defenceSteps.confirmYourDetails(createDefendant(testData.defendantPartyType, false))
    defenceSteps.requestNoExtraTimeToRespond()
    defenceSteps.rejectAllOfClaimAsDisputeClaim()
    defendantSteps.selectTaskWhyDoYouDisagreeWithTheClaim()
    whyYouDisagreePage.enterReason(claimantResponseTestData.pageSpecificValues.whyYouDisagreePageEnterReason)
    timelineEventsPage.enterTimelineEvent(
      claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.eventNum,
      claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.date,
      claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.description
    )
    timelineEventsPage.submitForm()
    evidencePage.enterEvidenceRow(
      claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.type,
      claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.description,
      claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.comment
    )
    defendantTaskListPage.selectTaskFreeMediation()
    mediationSteps.rejectMediation()
    defendantTaskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney()
    defendantSteps.selectCheckAndSubmitYourDefence()
    defenceSteps.checkAndSendAndSubmit(testData.defendantPartyType, testData.defenceType)
    I.see('You’ve submitted your response')
    I.see(`We’ve emailed ${createClaimant(PartyType.INDIVIDUAL).name} your response, explaining why you reject the claim.`)
  }

  disputeClaimAsAlreadyPaid (testData: EndToEndTestData, claimantResponseTestData: ClaimantResponseTestData, isClaimTotalPaid: boolean): void {
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    defenceSteps.confirmYourDetails(createDefendant(testData.defendantPartyType, false))
    defenceSteps.requestNoExtraTimeToRespond()
    defenceSteps.rejectAllOfClaimAsAlreadyPaid()
    defendantSteps.selectTaskTellUsHowMuchYouHavePaid()

    howMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.paidAmount,
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.date,
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.explanation
    )
    if (!isClaimTotalPaid) {
      youHavePaidLessPage.continue()
      defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
      whyYouDisagreePage.enterReason(claimantResponseTestData.pageSpecificValues.whyYouDisagreePageEnterReason)
      timelineEventsPage.enterTimelineEvent(
        claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.eventNum,
        claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.date,
        claimantResponseTestData.pageSpecificValues.timelineEventsPageEnterTimelineEvent.description
      )
      timelineEventsPage.submitForm()
      evidencePage.enterEvidenceRow(
        claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.type,
        claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.description,
        claimantResponseTestData.pageSpecificValues.evidencePageEnterEvidenceRow.comment
      )
    }
    defendantTaskListPage.selectTaskFreeMediation()
    mediationSteps.rejectMediationByDisagreeing()
    defendantTaskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireYesJourney()
    defendantSteps.selectCheckAndSubmitYourDefence()
    I.bypassPCQ()
    defenceSteps.checkAndSendAndSubmit(testData.defendantPartyType, testData.defenceType)
    I.see('You’ve submitted your response')
  }

}
