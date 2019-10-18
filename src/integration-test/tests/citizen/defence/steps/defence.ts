import { PaymentOption } from 'integration-test/data/payment-option'
import { claimAmount, DEFAULT_PASSWORD, defence } from 'integration-test/data/test-data'
import { DefendantCheckAndSendPage } from 'integration-test/tests/citizen/defence/pages/defendant-check-and-send'
import { DefendantDefenceTypePage } from 'integration-test/tests/citizen/defence/pages/defendant-defence-type'
import { DefendantDobPage } from 'integration-test/tests/citizen/defence/pages/defendant-dob'
import { DefendantEnterClaimPinNumberPage } from 'integration-test/tests/citizen/defence/pages/defendant-enter-claim-pin-number'
import { DefendantEnterClaimReferencePage } from 'integration-test/tests/citizen/defence/pages/defendant-enter-claim-reference'
import { DefendantHowMuchHaveYouPaidPage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-have-you-paid'
import { DefendantImpactOfDisputePage } from 'integration-test/tests/citizen/defence/pages/defendant-impact-of-dispute'
import { DefendantMobilePage } from 'integration-test/tests/citizen/defence/pages/defendant-mobile'
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
import { DefendantMoreTimeConfirmationPage } from 'integration-test/tests/citizen/defence/pages/defendant-more-time-confirmation'
import { DefendantSendCompanyFinancialDetails } from 'integration-test/tests/citizen/defence/pages/defendant-send-company-financial-details'
import { StatementOfMeansSteps } from 'integration-test/tests/citizen/defence/steps/statementOfMeans'
import { LoginPage } from 'integration-test/tests/citizen/home/pages/login'
import { DefendantSteps } from 'integration-test/tests/citizen/home/steps/defendant'
import { PartyType } from 'integration-test/data/party-type'
import { DefenceType } from 'integration-test/data/defence-type'
import { ClaimStoreClient } from 'integration-test/helpers/clients/claimStoreClient'
import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { DefendantEvidencePage } from 'integration-test/tests/citizen/defence/pages/defendant-evidence'
import { AlreadyPaidPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/already-paid'
import { DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage } from 'integration-test/tests/citizen/defence/pages/defendant-have-you-paid-the-claimant-the-amount-you-admit-you-owe'
import { DefendantHowMuchYouOwePage } from 'integration-test/tests/citizen/defence/pages/defendant-how-much-you-owe'
import { MediationSteps } from 'integration-test/tests/citizen/mediation/steps/mediation'
import I = CodeceptJS.I

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
const defendantDefenceTypePage: DefendantDefenceTypePage = new DefendantDefenceTypePage()
const defendantRejectAllOfClaimPage: DefendantRejectAllOfClaimPage = new DefendantRejectAllOfClaimPage()
const defendantYourDefencePage: DefendantYourDefencePage = new DefendantYourDefencePage()
const alreadyPaidPage: AlreadyPaidPage = new AlreadyPaidPage()
const defendantCheckAndSendPage: DefendantCheckAndSendPage = new DefendantCheckAndSendPage()
const defendantHowMuchHaveYouPaidTheClaimant: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const defendantTimelineOfEventsPage: DefendantTimelineEventsPage = new DefendantTimelineEventsPage()
const defendantEvidencePage: DefendantEvidencePage = new DefendantEvidencePage()
const defendantImpactOfDisputePage: DefendantImpactOfDisputePage = new DefendantImpactOfDisputePage()
const defendantMoreTimeConfirmationPage: DefendantMoreTimeConfirmationPage = new DefendantMoreTimeConfirmationPage()
const loginPage: LoginPage = new LoginPage()
const defendantTaskListPage: DefendantTaskListPage = new DefendantTaskListPage()
const defendantPaymentDatePage: DefendantPaymentDatePage = new DefendantPaymentDatePage()
const defendantPaymentPlanPage: DefendantPaymentPlanPage = new DefendantPaymentPlanPage()
const defendantWhenWillYouPage: DefendantWhenWillYouPayPage = new DefendantWhenWillYouPayPage()
const sendCompanyDetailsPage: DefendantSendCompanyFinancialDetails = new DefendantSendCompanyFinancialDetails()
const defendantSteps: DefendantSteps = new DefendantSteps()
const statementOfMeansSteps: StatementOfMeansSteps = new StatementOfMeansSteps()
const defendantHowMuchHaveYouPaidPage: DefendantHowMuchHaveYouPaidPage = new DefendantHowMuchHaveYouPaidPage()
const haveYouPaidTheClaimantPage: DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage = new DefendantHaveYouPaidTheClaimantTheAmountYouAdmitYouOwePage()
const defendantHowMuchYouOwePage: DefendantHowMuchYouOwePage = new DefendantHowMuchYouOwePage()
const updatedAddress = { line1: 'ABC Street', line2: 'A cool place', city: 'Bristol', postcode: 'BS1 5TL' }
const mediationSteps: MediationSteps = new MediationSteps()

const defendantRepaymentPlan: PaymentPlan = {
  equalInstalment: 20.00,
  firstPaymentDate: '2025-01-01',
  frequency: 'everyWeek'
}

export class DefenceSteps {

  async getClaimPin (claimRef: string, authorisation: string): Promise<string> {
    const claim: Claim = await ClaimStoreClient.retrieveByReferenceNumber(claimRef, { bearerToken: authorisation })

    return IdamClient.getPin(claim.letterHolderId)
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

  requestNoExtraTimeToRespond (): void {
    defendantSteps.selectTaskMoreTimeNeededToRespond()
    defendantMoreTimeRequestPage.chooseNo()
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
    defendantSteps.selectTaskTellUsHowMuchYouHavePaid()
    defendantHowMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(claimAmount.getTotal() - 1, '2018-01-01', 'Paid Cash')
  }

  enterWhenDidYouPay (defence: PartialDefence) {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.rejectAllOfMoneyClaim()
    defendantRejectAllOfClaimPage.selectAlreadyPaidOption()
    defendantSteps.selectTaskTellUsHowMuchYouHavePaid()
    defendantHowMuchHaveYouPaidPage.enterAmountPaidWithDateAndExplanation(claimAmount.getTotal(), '2018-01-01', 'Paid Cash')
  }

  admitPartOfTheClaim (defence: PartialDefence): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()
    alreadyPaidPage.chooseNo()
    defendantTaskListPage.selectTaskHowMuchMoneyBelieveYouOwe()
    defendantHowMuchYouOwePage.enterAmountOwed(50)
    defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
    defendantYourDefencePage.enterYourDefence('I do not like it')
    this.addTimeLineOfEvents(defence.timeline)
    this.enterEvidence('description', 'They do not have evidence')
    defendantTaskListPage.selectTaskWhenWillYouPay()
    defendantWhenWillYouPage.chooseFullBySetDate()
    defendantPaymentDatePage.enterDate('2025-01-01')
    defendantPaymentDatePage.saveAndContinue()
    I.see('Respond to a money claim')
  }

  admitPartOfTheClaimAlreadyPaid (
    defence: PartialDefence,
    isClaimAlreadyPaid: boolean = true
  ): void {
    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()

    if (isClaimAlreadyPaid) {
      alreadyPaidPage.chooseYes()
      I.see('How much have you paid?')
      defendantSteps.selectTaskHowMuchHaveYouPaid()
      defendantHowMuchHaveYouPaidTheClaimant.enterAmountPaidWithDateAndExplanation(
        100,
        '1990-01-01',
        'I will not pay that much!'
      )
      defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
      defendantYourDefencePage.enterYourDefence('I do not like it')
      this.addTimeLineOfEvents(defence.timeline)
      this.enterEvidence('description', 'They do not have evidence')
    } else {
      alreadyPaidPage.chooseNo()
      I.see('How much money do you admit you owe?')
      defendantSteps.selectTaskHowMuchMoneyBelieveYouOwe()
      defendantHowMuchYouOwePage.enterAmountOwed(50)
      defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
      defendantYourDefencePage.enterYourDefence('I paid half')
      this.addTimeLineOfEvents(defence.timeline)
      this.enterEvidence('description', 'Some evidence')
      I.see('When will you pay the £50?')
      defendantSteps.selectTaskWhenYouWillPay()
      defendantWhenWillYouPage.chooseInstalments()
      defendantTaskListPage.selectYourRepaymentPlanTask()
      defendantPaymentPlanPage.enterRepaymentPlan(defendantRepaymentPlan)
      defendantPaymentPlanPage.saveAndContinue()
      defendantTaskListPage.selectShareYourFinancialDetailsTask()
      statementOfMeansSteps.fillStatementOfMeansWithFullDataSet()
    }

    I.see('Respond to a money claim')
  }

  submitDefenceText (text: string): void {
    defendantSteps.selectTaskWhyDoYouDisagreeWithTheClaim()
    defendantYourDefencePage.enterYourDefence(text)
  }

  askForMediation (defendantType: PartyType = PartyType.INDIVIDUAL): void {
    defendantSteps.selectTaskFreeMediation(defendantType)
  }

  askForHearingRequirements (defendantType: PartyType = PartyType.INDIVIDUAL): void {
    defendantSteps.selectTaskHearingRequirements(defendantType)
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

  checkAndSendAndSubmit (defendantType: PartyType, defenceType: DefenceType): void {
    if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
      defendantCheckAndSendPage.signStatementOfTruthAndSubmit('Jonny', 'Director', defenceType)
    } else {
      defendantCheckAndSendPage.checkFactsTrueAndSubmit(defenceType)
    }
  }

  makeDefenceAndSubmit (
    defendantParty: Party,
    defendantEmail: string,
    defendantType: PartyType,
    defenceType: DefenceType,
    isRequestMoreTimeToRespond: boolean = true,
    isClaimAlreadyPaid: boolean = true
  ): void {
    I.see('Confirm your details')
    I.see('Decide if you need more time to respond')
    I.see('Choose a response')
    this.confirmYourDetails(defendantParty)
    I.see('COMPLETE')

    if (isRequestMoreTimeToRespond) {
      this.requestMoreTimeToRespond()
    } else {
      this.requestNoExtraTimeToRespond()
    }

    switch (defenceType) {
      case DefenceType.FULL_REJECTION_WITH_DISPUTE:
        this.rejectAllOfClaimAsDisputeClaim()
        I.see('Tell us why you disagree with the claim')
        this.submitDefenceText('I fully dispute this claim')
        this.addTimeLineOfEvents({
          events: [{ date: 'may', description: 'ok' } as TimelineEvent, {
            date: 'june',
            description: 'ok'
          } as TimelineEvent]
        } as Timeline)
        this.enterEvidence('description', 'comment')
        this.askForMediation(defendantType)
        this.askForHearingRequirements(defendantType)
        defendantSteps.selectCheckAndSubmitYourDefence()
        break
      case DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID:
        this.enterWhenDidYouPay(defence)
        this.askForMediation(defendantType)
        this.askForHearingRequirements(defendantType)
        defendantSteps.selectCheckAndSubmitYourDefence()
        I.see('When did you pay this amount?')
        I.see('How did you pay this amount?')
        break
      case DefenceType.PART_ADMISSION_NONE_PAID:
        this.admitPartOfTheClaim(defence)
        this.askForMediation(defendantType)
        this.askForHearingRequirements(defendantType)
        if (defendantType === PartyType.COMPANY || defendantType === PartyType.ORGANISATION) {
          defendantTaskListPage.selectShareYourFinancialDetailsTask()
          sendCompanyDetailsPage.continue()
        }

        defendantSteps.selectCheckAndSubmitYourDefence()
        I.see('How much money do you admit you owe?')
        break
      case DefenceType.PART_ADMISSION:
        this.admitPartOfTheClaimAlreadyPaid(defence, isClaimAlreadyPaid)
        this.askForMediation(defendantType)
        this.askForHearingRequirements(defendantType)
        defendantSteps.selectCheckAndSubmitYourDefence()
        if (isClaimAlreadyPaid) {
          I.see('How much money have you paid?')
        } else {
          I.see('How much money do you admit you owe?')
        }
        break
      default:
        throw new Error('Unknown DefenceType')
    }
    this.checkAndSendAndSubmit(defendantType, defenceType)
    I.see('You’ve submitted your response')
  }

  makeFullAdmission (
    defendantParty: Party,
    defendantType: PartyType,
    paymentOption: PaymentOption,
    claimantName: string,
    statementOfMeansFullDataSet: boolean = true
  ): void {
    this.confirmYourDetails(defendantParty)

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
        statementOfMeansFullDataSet ? statementOfMeansSteps.fillStatementOfMeansWithFullDataSet()
          : statementOfMeansSteps.fillStatementOfMeansWithMinimalDataSet('50')
        break
      default:
        throw new Error(`Unknown payment option: ${paymentOption}`)
    }

    defendantSteps.selectCheckAndSubmitYourDefence()
    this.checkAndSendAndSubmit(defendantType, DefenceType.FULL_ADMISSION)

    I.see('You’ve submitted your response')

    switch (paymentOption) {
      case PaymentOption.IMMEDIATELY:
        I.see(`We’ve emailed ${claimantName} to tell them you’ll pay immediately.`)
        break
      case PaymentOption.BY_SET_DATE:
        I.see(`We’ve emailed ${claimantName} your offer to pay by 1 January 2025 and your explanation of why you can’t pay before then.`)
        break
      case PaymentOption.INSTALMENTS:
        I.see(`We’ve emailed ${claimantName} to tell them you’ve suggested paying by instalments.`)
        break
      default:
        throw new Error(`Unknown payment option: ${paymentOption}`)
    }
  }

  makePartialAdmission (defendantParty: Party): void {
    this.confirmYourDetails(defendantParty)

    this.requestMoreTimeToRespond()

    defendantSteps.selectTaskChooseAResponse()
    defendantDefenceTypePage.admitPartOfMoneyClaim()
  }

  partialPaymentMade (defendantType: PartyType): void {
    I.see('Have you paid the claimant the amount you admit you owe?')
    haveYouPaidTheClaimantPage.selectYesOption()
    defendantSteps.selectTaskHowMuchHaveYouPaid()
    defendantHowMuchHaveYouPaidTheClaimant.enterAmountPaidWithDateAndExplanation(
      defence.paidWhatIBelieveIOwe.howMuchAlreadyPaid,
      defence.paidWhatIBelieveIOwe.paidDate,
      defence.paidWhatIBelieveIOwe.explanation)
    defendantSteps.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
    defendantYourDefencePage.enterYourDefence('I have already paid for the bill')
    this.addTimeLineOfEvents(defence.timeline)
    this.enterEvidence('description', 'They do not have evidence')
    this.askForMediation(defendantType)
    this.askForHearingRequirements(defendantType)
    defendantSteps.selectCheckAndSubmitYourDefence()
    this.checkAndSendAndSubmit(defendantType, DefenceType.PART_ADMISSION)
    I.see('You’ve submitted your response')
  }

  partialPaymentNotMade (defendantType: PartyType, paymentOption: PaymentOption): void {
    I.see('Have you paid the claimant the amount you admit you owe?')
    haveYouPaidTheClaimantPage.selectNoOption()
    defendantTaskListPage.selectTaskHowMuchMoneyBelieveYouOwe()
    defendantHowMuchYouOwePage.enterAmountOwed(10)
    defendantTaskListPage.selectTaskWhyDoYouDisagreeWithTheAmountClaimed()
    defendantYourDefencePage.enterYourDefence('random text')
    this.addTimeLineOfEvents(defence.timeline)
    this.enterEvidence('description', 'They do not have evidence')
    defendantTaskListPage.selectTaskWhenWillYouPay()
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
        defendantRepaymentPlan.equalInstalment = 5.00  // total claimed = £10
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
    defendantTaskListPage.selectTaskFreeMediation()
    mediationSteps.rejectMediation()
    this.askForHearingRequirements(defendantType)
    defendantTaskListPage.selectTaskCheckAndSendYourResponse()
    this.checkAndSendAndSubmit(defendantType, DefenceType.PART_ADMISSION_NONE_PAID)
    I.see('You’ve submitted your response')
  }

  sendDefenceResponseHandOff (claimRef: string, defendant: Party, claimant: Party, defenceType: DefenceType): void {
    I.click('Respond to claim')
    I.see('Confirm your details')
    I.see('Decide if you need more time to respond')
    I.see('Choose a response')
    I.dontSee('Your defence')

    this.confirmYourDetails(defendant)
    I.see('COMPLETE')

    this.requestMoreTimeToRespond()

    switch (defenceType) {
      case DefenceType.FULL_REJECTION_WITH_COUNTER_CLAIM:
        this.admitAllOfClaimAndMakeCounterClaim()
        I.see('Download the defence and counterclaim form.')
        break
      case DefenceType.FULL_REJECTION_BECAUSE_ALREADY_PAID_LESS_THAN_CLAIMED_AMOUNT:
        this.chooseLessThenAmountClaimedOption()
        I.see('Download the admission form and the defence form')
        break
      default:
        throw new Error('Unknown DefenceType')
    }

    I.see('Post your response')
    I.see(claimRef)
    I.see(claimant.name)
    I.see(defendant.title)
    I.see(defendant.firstName)
    I.see(defendant.lastName)
  }
}
