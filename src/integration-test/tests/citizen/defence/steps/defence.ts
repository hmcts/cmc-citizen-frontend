import { createDefendant, DEFAULT_PASSWORD, defence } from 'integration-test/data/test-data'
import { DefendantCheckAndSendPage } from 'integration-test/tests/citizen/defence/pages/defendant-check-and-send'
import { DefendantDefenceTypePage } from 'integration-test/tests/citizen/defence/pages/defendant-defence-type'
import { DefendantDobPage } from 'integration-test/tests/citizen/defence/pages/defendant-dob'
import { DefendantEnterClaimPinNumberPage } from 'integration-test/tests/citizen/defence/pages/defendant-enter-claim-pin-number'
import { DefendantEnterClaimReferencePage } from 'integration-test/tests/citizen/defence/pages/defendant-enter-claim-reference'
import { DefendantFreeMediationPage } from 'integration-test/tests/citizen/defence/pages/defendant-free-mediation'
import { DefendantHowMuchHaveYouPaidPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid'
import { DefendantHowMuchYouOwePage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-you-owe'
import { DefendantImpactOfDisputePage } from 'integration-test/tests/citizen/defence/pages/defendant-impact-of-dispute'
import { DefendantMobilePage } from 'integration-test/tests/citizen/defence/pages/defendant-mobile'
import { DefendantMoreTimeConfirmationPage } from 'integration-test/tests/citizen/defence/pages/defendant-more-time-confirmation'
import { DefendantMoreTimeRequestPage } from 'integration-test/tests/citizen/defence/pages/defendant-more-time-request'
import { DefendantNameAndAddressPage } from 'integration-test/tests/citizen/defence/pages/defendant-name-and-address'
import { DefendantPaymentPlanPage } from 'integration-test/tests/citizen/defence/pages/defendant-payment-plan'
import { DefendantRegisterPage } from 'integration-test/tests/citizen/defence/pages/defendant-register'
import { DefendantRejectAllOfClaimPage } from 'integration-test/tests/citizen/defence/pages/defendant-reject-all-of-claim'
import { DefendantRejectPartOfClaimPage } from 'integration-test/tests/citizen/defence/pages/defendant-reject-part-of-claim'
import { DefendantStartPage } from 'integration-test/tests/citizen/defence/pages/defendant-start'
import { DefendantTimelineEventsPage } from 'integration-test/tests/citizen/defence/pages/defendant-timeline-events'
import { DefendantViewClaimPage } from 'integration-test/tests/citizen/defence/pages/defendant-view-claim'
import { DefendantWhenWillYouPayPage } from 'integration-test/tests/citizen/defence/pages/defendant-when-will-you-pay'
import { DefendantYourDefencePage } from 'integration-test/tests/citizen/defence/pages/defendant-your-defence'
import { StatementOfMeansSteps } from 'integration-test/tests/citizen/defence/steps/statementOfMeans'
import { LoginPage } from 'integration-test/tests/citizen/home/pages/login'
import { DefendantSteps } from 'integration-test/tests/citizen/home/steps/defendant'
import { PartyType } from 'integration-test/data/party-type'
import { DefenceType } from 'integration-test/data/defence-type'
import { DefendantHowMuchHaveYouPaidClaimantPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid-claimant'
import { DefendantWhenDidYouPayPage } from 'integration-test/tests/citizen/defence/pages/defendant-when-did-you-pay'
import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import I = CodeceptJS.I
import { DefendantEvidencePage } from 'integration-test/tests/citizen/defence/pages/defendant-evidence'

const I: I = actor()
const defendantStartPage: DefendantStartPage = new DefendantStartPage()
const defendantEnterClaimRefPage: DefendantEnterClaimReferencePage = new DefendantEnterClaimReferencePage()
const defendantEnterPinPage: DefendantEnterClaimPinNumberPage = new DefendantEnterClaimPinNumberPage()
const defendantViewClaimPage: DefendantViewClaimPage = new DefendantViewClaimPage()
const defendantRegisterPage: DefendantRegisterPage = new DefendantRegisterPage()
const defendantNameAndAddressPage: DefendantNameAndAddressPage = new DefendantNameAndAddressPage()
const defendantDobPage: DefendantDobPage = new DefendantDobPage()
const defendantMobilePage: DefendantMobilePage = new DefendantMobilePage()
const defendantMoreTimeRequestPage: DefendantMoreTimeRequestPage = new DefendantMoreTimeRequestPage()
const defendantMoreTimeConfirmationPage: DefendantMoreTimeConfirmationPage = new DefendantMoreTimeConfirmationPage()
const defendantDefenceTypePage: DefendantDefenceTypePage = new DefendantDefenceTypePage()
const defendantRejectAllOfClaimPage: DefendantRejectAllOfClaimPage = new DefendantRejectAllOfClaimPage()
const defendantYourDefencePage: DefendantYourDefencePage = new DefendantYourDefencePage()
const defendantFreeMediationPage: DefendantFreeMediationPage = new DefendantFreeMediationPage()
const defendantCheckAndSendPage: DefendantCheckAndSendPage = new DefendantCheckAndSendPage()
const defendantHowMuchYouBelieveYouOwePage: DefendantHowMuchYouOwePage = new DefendantHowMuchYouOwePage()
const defendantHowMuchHaveYouPaidTheClaimant: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const defendantRejectPartOfClaimPage: DefendantRejectPartOfClaimPage = new DefendantRejectPartOfClaimPage()
const defendantTimelineOfEventsPage: DefendantTimelineEventsPage = new DefendantTimelineEventsPage()
const defendantEvidencePage: DefendantEvidencePage = new DefendantEvidencePage()
const defendantImpactOfDisputePage: DefendantImpactOfDisputePage = new DefendantImpactOfDisputePage()
const loginPage: LoginPage = new LoginPage()
const defendantPaymentPlanPage: DefendantPaymentPlanPage = new DefendantPaymentPlanPage()
const defendantWhenWillYouPage: DefendantWhenWillYouPayPage = new DefendantWhenWillYouPayPage()
const defendantSteps: DefendantSteps = new DefendantSteps()
const statementOfMeansSteps: StatementOfMeansSteps = new StatementOfMeansSteps()
const defendantHowMuchHaveYouPaidClaimantPage: DefendantHowMuchHaveYouPaidClaimantPage = new DefendantHowMuchHaveYouPaidClaimantPage()
const defendantWhenDidYouPayPage: DefendantWhenDidYouPayPage = new DefendantWhenDidYouPayPage()

const updatedAddress = { line1: 'ABC Street', line2: 'A cool place', city: 'Bristol', postcode: 'AAA BCC' }

const defendantRepaymentPlan: PaymentPlan = {
  equalInstalment: 20.00,
  firstPaymentDate: '2025-01-01',
  frequency: 'everyWeek'
}

const text = 'I owe nothing'

export class DefenceSteps {

  async getClaimPin (claimRef: string, authorisation: string): Promise<string> {
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(claimRef, { bearerToken: authorisation })

    const pinResponse = await IdamClient.getPin(claim.letterHolderId)

    return pinResponse.body
  }

  enterClaimReference (claimRef: string): void {
    defendantStartPage.open()
    defendantStartPage.start()
    defendantEnterClaimRefPage.enterClaimReference(claimRef)
  }

  async enterClaimPin (claimRef: string, authorisation: string): Promise<void> {
    const claimPinNumber = await this.getClaimPin(claimRef, authorisation)
    defendantEnterPinPage.enterPinNumber(claimPinNumber)
  }

  respondToClaim (): void {
    I.see('Claim number')
    I.see('Claim amount')
    I.see('Reason for claim')
    defendantViewClaimPage.clickRespondToClaim()
  }

  loginAsDefendant (defendantEmail: string): void {
    defendantRegisterPage.clickLinkIAlreadyHaveAnAccount()
    loginPage.login(defendantEmail, DEFAULT_PASSWORD)
  }

  confirmYourDetails (defendant: Party): void {

    defendantSteps.selectTaskConfirmYourDetails()
    defendantNameAndAddressPage.enterAddress(updatedAddress)

    if (defendant.type === PartyType.INDIVIDUAL) {
      defendantDobPage.enterDOB(defendant.dateOfBirth)
    }
    defendantMobilePage.enterMobile(defendant.mobilePhone)
  }

  requestMoreTimeToRespond (): void {
    defendantSteps.selectTaskMoreTimeNeededToRespond()
    defendantMoreTimeRequestPage.chooseYes()
    defendantMoreTimeConfirmationPage.confirm()
  }

  rejectAllOfClaimAsDisputeClaim (): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.rejectAllOfMoneyClaim()
    defendantRejectAllOfClaimPage.selectDisputeTheClaimOption()
  }

  rejectAllOfClaimAsAlreadyPaid (): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.rejectAllOfMoneyClaim()
    defendantRejectAllOfClaimPage.selectAlreadyPaidOption()
  }

  addTimeLineOfEvents (timeline: Timeline): void {
    I.see('Add your timeline of events')
    defendantTimelineOfEventsPage.enterTimelineEvent(0, timeline.events[0].date, timeline.events[0].description)
    defendantTimelineOfEventsPage.enterTimelineEvent(1, timeline.events[1].date, timeline.events[1].description)
    defendantTimelineOfEventsPage.submitForm()
  }

  enterEvidence (description: string, comment: string): void {
    I.see('Add your timeline of events')
    defendantEvidencePage.enterEvidenceRow('CONTRACTS_AND_AGREEMENTS', description, comment)
  }

  explainImpactOfDispute (impactOfDispute: string): void {
    I.see('How this dispute has affected you?')
    defendantImpactOfDisputePage.enterImpactOfDispute(impactOfDispute)
    defendantImpactOfDisputePage.submitForm()
  }

  admitAllOfClaim () {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitAllOfMoneyClaim()
  }

  admitPartOfClaim () {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()
  }

  admitAllOfClaimAndMakeCounterClaim () {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.rejectAllOfMoneyClaim()
    defendantRejectAllOfClaimPage.selectCounterClaimOption()
  }

  chooseLessThenAmountClaimedOption () {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.rejectAllOfMoneyClaim()
    defendantRejectAllOfClaimPage.selectAlreadyPaidOption()
    defendantHowMuchHaveYouPaidClaimantPage.selectLessThanClaimedOption()
  }

  enterWhenDidYouPay (defence: PartialDefence) {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.rejectAllOfMoneyClaim()
    defendantRejectAllOfClaimPage.selectAlreadyPaidOption()
    defendantHowMuchHaveYouPaidClaimantPage.selectAmountClaimedOption()
    defendantSteps.selectTaskWhenDidYouPay()
    defendantWhenDidYouPayPage.enterDateAndExplaination('2017-01-01', 'Paid Cash')
    I.click('Save and continue')
  }

  rejectPartOfTheClaim_PaidWhatIBelieveIOwe (defence: PartialDefence): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()
    defendantRejectPartOfClaimPage.rejectClaimPaidWhatIBelieveIOwe()
    I.see('Respond to a money claim')
    defendantSteps.selectTaskHowMuchPaidToClaiment()
    defendantHowMuchHaveYouPaidTheClaimant.enterAmountPaidWithDateAndExplaination(
      defence.paidWhatIBelieveIOwe.howMuchAlreadyPaid,
      defence.paidWhatIBelieveIOwe.paidDate,
      defence.paidWhatIBelieveIOwe.explanation)
    this.addTimeLineOfEvents(defence.timeline)
    this.enterEvidence('description', 'They do not have evidence')
    this.explainImpactOfDispute(defence.impactOfDispute)
    defendantSteps.selectTaskFreeMediation()
    defendantFreeMediationPage.chooseYes()
  }

  rejectPartOfTheClaimTooMuch (defence: PartialDefence): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()
    defendantRejectPartOfClaimPage.rejectClaimTooMuch()
    I.see('Respond to a money claim')
    defendantSteps.selectTaskHowMuchMoneyBelieveYouOwe()
    defendantHowMuchYouBelieveYouOwePage.enterAmountOwedAndExplaination(
      defence.claimAmountIsTooMuch.howMuchIBelieveIOwe,
      defence.claimAmountIsTooMuch.explanation)
    this.addTimeLineOfEvents(defence.timeline)
    this.enterEvidence('description', 'They do not have evidence')
    this.explainImpactOfDispute(defence.impactOfDispute)
    defendantSteps.selectTaskWhenWillYouPay()
    defendantWhenWillYouPage.chooseInstalments()
    defendantPaymentPlanPage.enterRepaymentPlan(defendantRepaymentPlan, text)
    statementOfMeansSteps.fillStatementOfMeansData()
    I.see('Respond to a money claim')
    defendantSteps.selectTaskFreeMediation()
    defendantFreeMediationPage.chooseYes()
  }

  submitDefenceText (text: string): void {
    defendantSteps.selectTaskWhyDoYouDisagreeWithTheClaim()
    defendantYourDefencePage.enterYourDefence(text)
  }

  askforMediation (): void {
    defendantSteps.selectTaskFreeMediation()
    defendantFreeMediationPage.chooseYes()
  }

  verifyCheckAndSendPageCorrespondsTo (defenceType: DefenceType): void {
    if (defenceType === DefenceType.PART_ADMISSION_BECAUSE_AMOUNT_IS_TOO_HIGH) {
      defendantCheckAndSendPage.verifyFactsPartialResponseClaimAmountTooMuch()
    } else {
      defendantCheckAndSendPage.verifyFactsPartialResponseIBelieveIPaidWhatIOwe()
    }
  }

  verifyImpactOfDisputeIsVisible (impactOfDispute: string): void {
    I.see(impactOfDispute)
  }

  checkAndSendAndSubmit (defendantType: PartyType): void {
    if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
      defendantCheckAndSendPage.signStatementOfTruthAndSubmit('Jonny', 'Director')
    } else {
      defendantCheckAndSendPage.checkFactsTrueAndSubmit()
    }
  }

  async makeDefenceAndSubmit (defendantEmail: string, defendantType: PartyType, defenceType: DefenceType): Promise<void> {
    I.click('Respond to claim')
    I.see('Confirm your details')
    I.see('Do you want more time to respond?')
    I.see('Choose a response')
    I.dontSee('COMPLETE')

    this.confirmYourDetails(createDefendant(defendantType))
    I.see('COMPLETED')

    this.requestMoreTimeToRespond()

    switch (defenceType) {
      case DefenceType.FULL_REJECTION_WITH_DISPUTE:
        this.rejectAllOfClaimAsDisputeClaim()
        I.see('Why do you disagree with the claim?')
        this.submitDefenceText('I fully dispute this claim')
        this.addTimeLineOfEvents({ events: [{ date: 'may', description: 'ok' } as TimelineEvent] } as Timeline)
        this.enterEvidence('description', 'comment')
        this.askforMediation()
        defendantSteps.selectCheckAndSubmitYourDefence()
        break

      case DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID:
        this.enterWhenDidYouPay(defence)
        this.submitDefenceText('I have already paid')
        this.addTimeLineOfEvents({ events: [{ date: 'may', description: 'ok' } as TimelineEvent] } as Timeline)
        this.enterEvidence('description', 'comment')
        defendantSteps.selectCheckAndSubmitYourDefence()
        I.see('When did you pay this amount?')
        I.see('How did you pay the amount claimed?')
        break

      default:
        throw new Error('Unknown DefenceType')
    }

    this.checkAndSendAndSubmit(defendantType)
    if (defenceType === DefenceType.FULL_REJECTION_WITH_DISPUTE || defenceType === DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID) {
      I.see('You’ve submitted your response')
    } else {
      I.see('Next steps')
    }
  }

  makeDefenceResponse (claimRef: string, defendant: Party, claimant: Party, defenceType: DefenceType = DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID): void {
    I.click('Respond to claim')
    I.see('Confirm your details')
    I.see('Do you want more time to respond?')
    I.see('Choose a response')
    I.dontSee('Your defence')
    I.dontSee('COMPLETE')

    this.confirmYourDetails(defendant)
    I.see('COMPLETE')

    this.requestMoreTimeToRespond()

    if (defenceType === DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID) {
      this.enterWhenDidYouPay(defence)
      this.submitDefenceText('I have already paid')
      this.addTimeLineOfEvents({ events: [{ date: 'may', description: 'ok' } as TimelineEvent] } as Timeline)
      this.enterEvidence('description', 'comment')
      defendantSteps.selectCheckAndSubmitYourDefence()
      I.see('When did you pay this amount?')
      I.see('How did you pay the amount claimed?')
    }
  }

  sendDefenceResponseHandOff (claimRef: string, defendant: Party, claimant: Party, defenceType: DefenceType): void {
    I.click('Respond to claim')
    I.see('Confirm your details')
    I.see('Do you want more time to respond?')
    I.see('Choose a response')
    I.dontSee('Your defence')
    I.dontSee('COMPLETE')

    this.confirmYourDetails(defendant)
    I.see('COMPLETE')

    this.requestMoreTimeToRespond()

    switch (defenceType) {

      case DefenceType.FULL_ADMISSION:
        this.admitAllOfClaim()
        I.see('Download the admission form')
        I.see(claimRef)
        I.see(claimant.name)
        I.see(defendant.name)
        break

      case DefenceType.PART_ADMISSION:
        this.admitPartOfClaim()
        I.see('Download the admission form')
        I.see(claimRef)
        I.see(claimant.name)
        I.see(defendant.name)
        break

      case DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM:
        this.admitAllOfClaimAndMakeCounterClaim()
        I.see('Counterclaim fee')
        I.see(claimRef)
        I.see(claimant.name)
        I.see(defendant.name)
        break

      case DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT:
        this.chooseLessThenAmountClaimedOption()
        I.see('the admission form')
        I.see(claimRef)
        I.see(claimant.name)
        I.see(defendant.name)
        break

      default:
        throw new Error('Unknown DefenceType')
    }
  }
}
