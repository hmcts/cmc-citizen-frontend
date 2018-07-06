import { PaymentOption } from 'integration-test/data/payment-option'
import { createClaimant, createDefendant, DEFAULT_PASSWORD, defence } from 'integration-test/data/test-data'
import { DefendantCheckAndSendPage } from 'integration-test/tests/citizen/defence/pages/defendant-check-and-send'
import { DefendantDefenceTypePage } from 'integration-test/tests/citizen/defence/pages/defendant-defence-type'
import { DefendantDobPage } from 'integration-test/tests/citizen/defence/pages/defendant-dob'
import { DefendantEnterClaimPinNumberPage } from 'integration-test/tests/citizen/defence/pages/defendant-enter-claim-pin-number'
import { DefendantEnterClaimReferencePage } from 'integration-test/tests/citizen/defence/pages/defendant-enter-claim-reference'
import { DefendantFreeMediationPage } from 'integration-test/tests/citizen/defence/pages/defendant-free-mediation'
import { DefendantHowMuchHaveYouPaidPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid'
import { DefendantImpactOfDisputePage } from 'integration-test/tests/citizen/defence/pages/defendant-impact-of-dispute'
import { DefendantMobilePage } from 'integration-test/tests/citizen/defence/pages/defendant-mobile'
import { DefendantMoreTimeConfirmationPage } from 'integration-test/tests/citizen/defence/pages/defendant-more-time-confirmation'
import { DefendantMoreTimeRequestPage } from 'integration-test/tests/citizen/defence/pages/defendant-more-time-request'
import { DefendantNameAndAddressPage } from 'integration-test/tests/citizen/defence/pages/defendant-name-and-address'
import { DefendantPaymentDatePage } from 'integration-test/tests/citizen/defence/pages/defendant-payment-date'
import { DefendantPaymentPlanPage } from 'integration-test/tests/citizen/defence/pages/defendant-payment-plan'
import { DefendantRegisterPage } from 'integration-test/tests/citizen/defence/pages/defendant-register'
import { DefendantRejectAllOfClaimPage } from 'integration-test/tests/citizen/defence/pages/defendant-reject-all-of-claim'
import { DefendantStartPage } from 'integration-test/tests/citizen/defence/pages/defendant-start'
import { DefendantTaskListPage } from 'integration-test/tests/citizen/defence/pages/defendant-task-list'
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
import { AlreadyPaidPage } from '../pages/statement-of-means/already-paid'

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
const alreadyPaidPage: AlreadyPaidPage = new AlreadyPaidPage()
const defendantCheckAndSendPage: DefendantCheckAndSendPage = new DefendantCheckAndSendPage()
const defendantHowMuchHaveYouPaidTheClaimant: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const defendantTimelineOfEventsPage: DefendantTimelineEventsPage = new DefendantTimelineEventsPage()
const defendantEvidencePage: DefendantEvidencePage = new DefendantEvidencePage()
const defendantImpactOfDisputePage: DefendantImpactOfDisputePage = new DefendantImpactOfDisputePage()
const loginPage: LoginPage = new LoginPage()
const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()
const defendantPaymentDatePage: DefendantPaymentDatePage = new DefendantPaymentDatePage()
const defendantPaymentPlanPage: DefendantPaymentPlanPage = new DefendantPaymentPlanPage()
const defendantWhenWillYouPage: DefendantWhenWillYouPayPage = new DefendantWhenWillYouPayPage()
const defendantSteps: DefendantSteps = new DefendantSteps()
const statementOfMeansSteps: StatementOfMeansSteps = new StatementOfMeansSteps()
const defendantHowMuchHaveYouPaidClaimantPage: DefendantHowMuchHaveYouPaidClaimantPage = new DefendantHowMuchHaveYouPaidClaimantPage()
const defendantWhenDidYouPayPage: DefendantWhenDidYouPayPage = new DefendantWhenDidYouPayPage()

const updatedAddress = { line1: 'ABC Street', line2: 'A cool place', city: 'Bristol', postcode: 'BS1 5TL' }

const defendantRepaymentPlan: PaymentPlan = {
  equalInstalment: 20.00,
  firstPaymentDate: '2025-01-01',
  frequency: 'everyWeek'
}

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
    I.see('List your evidence')
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

  admitPartOfTheClaimAlreadyPaid (defence: PartialDefence): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()
    alreadyPaidPage.chooseYes()
    I.see('How much have you paid?')

    defendantSteps.selectTaskHowMuchHaveYouPaid()

    defendantHowMuchHaveYouPaidTheClaimant.enterAmountPaidWithDateAndExplaination(
      100,
      { day: '1', month: '1', year: '1990' },
      'I will not pay that much!'
    )

    defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
    defendantYourDefencePage.enterYourDefence('I do not like it')
    this.addTimeLineOfEvents(defence.timeline)
    this.enterEvidence('description', 'They do not have evidence')
    I.see('Respond to a money claim')
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
        defendantSteps.selectCheckAndSubmitYourDefence()
        I.see('When did you pay this amount?')
        I.see('How did you pay the amount claimed?')
        break
      case DefenceType.PART_ADMISSION:
        this.admitPartOfTheClaimAlreadyPaid(defence)
        defendantSteps.selectCheckAndSubmitYourDefence()
        I.see('How much have you paid?')
        I.see(defence.claimAmountIsTooMuch.explanation)
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

  makeFullAdmission (defendantType: PartyType, paymentOption: PaymentOption): void {
    I.dontSee('COMPLETE')

    this.confirmYourDetails(createDefendant(defendantType))

    this.requestMoreTimeToRespond()

    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitAllOfMoneyClaim()
    defendantSteps.selectTaskDecideHowWillYouPay()

    switch (paymentOption) {
      case PaymentOption.IMMEDIATELY:
        defendantWhenWillYouPage.chooseImmediately()
        break
      case PaymentOption.BY_SET_DATE:
        defendantWhenWillYouPage.chooseFullBySetDate()
        defendantPaymentDatePage.enterDate('2025-01-01')
        defendantPaymentDatePage.saveAndContinue()
        defendantTaskListPage.selectShareYourFinancialDetailsTask()
        statementOfMeansSteps.fillStatementOfMeansWithMinimalDataSet()
        break
      case PaymentOption.INSTALMENTS:
        defendantWhenWillYouPage.chooseInstalments()
        defendantTaskListPage.selectYourRepaymentPlanTask()
        defendantPaymentPlanPage.enterRepaymentPlan(defendantRepaymentPlan)
        defendantPaymentPlanPage.saveAndContinue()
        defendantTaskListPage.selectShareYourFinancialDetailsTask()
        statementOfMeansSteps.fillStatementOfMeansWithFullDataSet()
        break
      default:
        throw new Error(`Unknown payment option: ${paymentOption}`)
    }

    defendantSteps.selectCheckAndSubmitYourDefence()
    this.checkAndSendAndSubmit(defendantType)

    I.see('You’ve submitted your response')

    switch (paymentOption) {
      case PaymentOption.IMMEDIATELY:
        I.see(`We’ve emailed ${createClaimant(PartyType.INDIVIDUAL).name} to tell them you’ll pay immediately.`)
        break
      case PaymentOption.BY_SET_DATE:
        I.see(`We’ve emailed ${createClaimant(PartyType.INDIVIDUAL).name} your offer to pay by 1 January 2025 and your explanation of why you can’t pay before then.`)
        break
      case PaymentOption.INSTALMENTS:
        I.see(`We’ve emailed ${createClaimant(PartyType.INDIVIDUAL).name} to tell them you’ve suggested paying by instalments.`)
        break
      default:
        throw new Error(`Unknown payment option: ${paymentOption}`)
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
