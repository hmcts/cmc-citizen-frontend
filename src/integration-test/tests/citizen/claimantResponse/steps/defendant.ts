import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { DefendantSteps } from 'integration-test/tests/citizen/home/steps/defendant'
import { createClaimant, createDefendant } from 'integration-test/data/test-data'
import { DefendantTimelineEventsPage } from 'integration-test/tests/citizen/defence/pages/defendant-timeline-events'
import { DefendantEvidencePage } from 'integration-test/tests/citizen/defence/pages/defendant-evidence'
import { DefendantFreeMediationPage } from 'integration-test/tests/citizen/defence/pages/defendant-free-mediation'
import { DefendantHowMuchHaveYouPaidPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid'
import { DefendantYouHavePaidLessPage } from 'integration-test/tests/citizen/defence/pages/defendant-you-have-paid-less'
import { DefendantWhyDoYouDisagreePage } from 'integration-test/tests/citizen/defence/pages/defendant-why-do-you-disagree'
import { ClaimantResponseTestData } from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'

const I: I = actor()
const defendantSteps: DefendantSteps = new DefendantSteps()
const defenceSteps: DefenceSteps = new DefenceSteps()
const timelineEventsPage: DefendantTimelineEventsPage = new DefendantTimelineEventsPage()
const evidencePage: DefendantEvidencePage = new DefendantEvidencePage()
const freeMediationPage: DefendantFreeMediationPage = new DefendantFreeMediationPage()
const howMuchHaveYouPaidPage: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const youHavePaidLessPage: DefendantYouHavePaidLessPage = new DefendantYouHavePaidLessPage()
const whyYouDisagreePage: DefendantWhyDoYouDisagreePage = new DefendantWhyDoYouDisagreePage()
const claimDetailsHeading: string = 'Claim details'

export class DefendantResponseSteps {

  disputeAllClaim (testData: EndToEndTestData, claimantResponseTestData: ClaimantResponseTestData): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    I.dontSee('COMPLETE')
    defenceSteps.confirmYourDetails(createDefendant(testData.defendantPartyType))
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
    defendantSteps.selectTaskFreeMediation()
    freeMediationPage.chooseNo()
    defendantSteps.selectCheckAndSubmitYourDefence()
    defenceSteps.checkAndSendAndSubmit(testData.defendantPartyType)
    I.see('You’ve submitted your response')
    I.see(`We’ve emailed ${createClaimant(PartyType.INDIVIDUAL).name} your response, explaining why you reject the claim.`)
  }

  disputeClaimAsAlreadyPaid (testData: EndToEndTestData, claimantResponseTestData: ClaimantResponseTestData, isClaimTotalPaid: boolean): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(testData.defendantEmail)
    I.click(testData.claimRef)
    I.click('Respond to claim')
    I.dontSee('COMPLETE')
    defenceSteps.confirmYourDetails(createDefendant(testData.defendantPartyType))
    defenceSteps.requestNoExtraTimeToRespond()
    defenceSteps.rejectAllOfClaimAsAlreadyPaid()
    defendantSteps.selectTaskTellUsHowMuchYouHavePaid()

    howMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.paidAmount,
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.date,
      claimantResponseTestData.pageSpecificValues.howMuchHaveYouPaidPageEnterAmountPaidWithDateAndExplanation.explanation
    )
    if (testData.isAdmissionsToggleOn) {
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
        defendantSteps.selectTaskFreeMediation()
        freeMediationPage.chooseNo()
      }
      defendantSteps.selectCheckAndSubmitYourDefence()
      defenceSteps.checkAndSendAndSubmit(testData.defendantPartyType)
      I.see('You’ve submitted your response')
    } else {
      I.see('Post your response')
    }
  }

}
