import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { DefendantSteps } from 'integration-test/tests/citizen/home/steps/defendant'
import { createClaimant, createDefendant } from 'integration-test/data/test-data'
import { DefendantYourDefencePage } from 'integration-test/tests/citizen/defence/pages/defendant-your-defence'
import { DefendantTimelineEventsPage } from 'integration-test/tests/citizen/defence/pages/defendant-timeline-events'
import { DefendantEvidencePage } from 'integration-test/tests/citizen/defence/pages/defendant-evidence'
import { DefendantFreeMediationPage } from 'integration-test/tests/citizen/defence/pages/defendant-free-mediation'
import { DefendantHowMuchHaveYouPaidPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid'
import { DefendantYouHavePaidLessPage } from 'integration-test/tests/citizen/defence/pages/defendant-you-have-paid-less'
import { DefendantWhyDoYouDisagreePage } from 'integration-test/tests/citizen/defence/pages/defendant-why-do-you-disagree'

const I: I = actor()
const defendantSteps: DefendantSteps = new DefendantSteps()
const defenceSteps: DefenceSteps = new DefenceSteps()
const timelineEventsPage: DefendantTimelineEventsPage = new DefendantTimelineEventsPage()
const evidencePage: DefendantEvidencePage = new DefendantEvidencePage()
const freeMediationPage: DefendantFreeMediationPage = new DefendantFreeMediationPage()
const yourDefencePage: DefendantYourDefencePage = new DefendantYourDefencePage()
const howMuchHaveYouPaidPage: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const youHavePaidLessPage: DefendantYouHavePaidLessPage = new DefendantYouHavePaidLessPage()
const whyYouDisagreePage: DefendantWhyDoYouDisagreePage = new DefendantWhyDoYouDisagreePage()
const claimDetailsHeading: string = 'Claim details'

export class DefendantResponseSteps {

  disputeAllClaim (
    claimRef: string,
    defendantEmail: string,
    defendantType: PartyType
  ): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
    I.click(claimRef)
    I.click('Respond to claim')
    I.dontSee('COMPLETE')
    defenceSteps.confirmYourDetails(createDefendant(defendantType))
    defenceSteps.requestNoExtraTimeToRespond()
    defenceSteps.rejectAllOfClaimAsDisputeClaim()
    defendantSteps.selectTaskWhyDoYouDisagreeWithTheClaim()
    yourDefencePage.enterYourDefence('Defendant rejects all the claim because...')
    timelineEventsPage.enterTimelineEvent(0, '1/1/2000', 'something')
    timelineEventsPage.submitForm()
    evidencePage.enterEvidenceRow('CONTRACTS_AND_AGREEMENTS', 'correspondence', 'have this evidence')
    defendantSteps.selectTaskFreeMediation()
    freeMediationPage.chooseNo()
    defendantSteps.selectCheckAndSubmitYourDefence()
    defenceSteps.checkAndSendAndSubmit(defendantType)
    I.see('You’ve submitted your response')
    I.see(`We’ve emailed ${createClaimant(PartyType.INDIVIDUAL).name} your response, explaining why you reject the claim.`)
  }

  disputeClaimAsAlreadyPaid (
    claimRef: string,
    defendantEmail: string,
    defendantType: PartyType,
    paidAmount: number,
    isClaimTotalPaid: boolean
  ): void {
    I.waitForText(claimDetailsHeading)
    defenceSteps.respondToClaim()
    defenceSteps.loginAsDefendant(defendantEmail)
    I.click(claimRef)
    I.click('Respond to claim')
    I.dontSee('COMPLETE')
    defenceSteps.confirmYourDetails(createDefendant(defendantType))
    defenceSteps.requestNoExtraTimeToRespond()
    defenceSteps.rejectAllOfClaimAsAlreadyPaid()
    defendantSteps.selectTaskTellUsHowMuchYouHavePaid()
    howMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(paidAmount, '2018-01-01', 'My explanation...')
    if (! isClaimTotalPaid) {
      youHavePaidLessPage.continue()
      defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
      whyYouDisagreePage.enterReason('Defendant rejects all the claim because...')
      timelineEventsPage.enterTimelineEvent(0, '1/1/2000', 'something')
      timelineEventsPage.submitForm()
      evidencePage.enterEvidenceRow('CONTRACTS_AND_AGREEMENTS', 'correspondence', 'have this evidence')
      defendantSteps.selectTaskFreeMediation()
      freeMediationPage.chooseNo()
    }
    defendantSteps.selectCheckAndSubmitYourDefence()
    defenceSteps.checkAndSendAndSubmit(defendantType)
    I.see('You’ve submitted your response')
  }

}
