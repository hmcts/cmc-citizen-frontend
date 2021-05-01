/* tslint:disable:no-console */

import I = CodeceptJS.I
import { PaymentOption } from 'integration-test/data/payment-option'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import {
  ClaimantResponseTestData,
  UnreasonableClaimantResponseTestData
} from 'integration-test/tests/citizen/claimantResponse/data/ClaimantResponseTestData'
import { ClaimantAcceptPaymentMethod } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-accept-payment-method'
import { ClaimantTaskListPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-task-list'
import { ClaimantChooseHowToProceed } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-choose-how-to-proceed'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'
import { ClaimantSignSettlementAgreement } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-sign-settlement-agreement'
import { ClaimantCcjPaidAmountSummaryPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-amount-summary'
import { ClaimantCcjPaidAnyMoneyPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-ccj-paid-any-money'
import { ClaimantPaymentOptionPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-option'
import { ClaimantPaymentDatePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-date'
import { ClaimantPaymentPlanPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-payment-plan'
import { ClaimantDefendantResponsePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-defendant-response'
import { ClaimantCourtOfferedSetDatePage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-court-offered-set-date'
import { ClaimantCourtOfferedInstalmentsPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-court-offered-instalments'
import { ClaimantPayBySetDateAcceptedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-pay-by-set-date-accepted'
import { ClaimantSettleAdmittedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-settle-admitted'
import { PaidInFullPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-paid-in-full'
import { DirectionsQuestionnaireSteps } from 'integration-test/tests/citizen/directionsQuestionnaire/steps/directionsQuestionnaireSteps'
import { ClaimantIntentionToProceedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-intention-to-proceed'
import { ClaimantPartPaymentReceivedPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-part-payment-received'
import { ClaimantRejectionReasonPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-rejection-reason'
import { claimAmount } from 'integration-test/data/test-data'
import { ClaimantSettleClaimPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-settle-claim'
import { FreeTelephoneMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-telephone-mediation'
import { MediationDisagreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-disagreement'
import { FreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/free-mediation'
import { HowMediationWorksPage } from 'integration-test/tests/citizen/mediation/pages/how-mediation-works'
import { WillYouTryMediationPage } from 'integration-test/tests/citizen/mediation/pages/will-you-try-mediation'
import { MediationAgreementPage } from 'integration-test/tests/citizen/mediation/pages/mediation-agreement'
import { CanWeUsePage } from 'integration-test/tests/citizen/mediation/pages/can-we-use'
import { ContinueWithoutMediationPage } from 'integration-test/tests/citizen/mediation/pages/continue-without-mediation'
import { TryFreeMediationPage } from 'integration-test/tests/citizen/mediation/pages/try-free-mediation'

const I: I = actor()
const taskListPage: ClaimantTaskListPage = new ClaimantTaskListPage()
const acceptPaymentMethodPage: ClaimantAcceptPaymentMethod = new ClaimantAcceptPaymentMethod()
const chooseHowToProceedPage: ClaimantChooseHowToProceed = new ClaimantChooseHowToProceed()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const signSettlementAgreementPage: ClaimantSignSettlementAgreement = new ClaimantSignSettlementAgreement()
const ccjPaidAmountSummaryPage: ClaimantCcjPaidAmountSummaryPage = new ClaimantCcjPaidAmountSummaryPage()
const ccjPaidAnyMoneyPage: ClaimantCcjPaidAnyMoneyPage = new ClaimantCcjPaidAnyMoneyPage()
const paymentOptionPage: ClaimantPaymentOptionPage = new ClaimantPaymentOptionPage()
const paymentDatePage: ClaimantPaymentDatePage = new ClaimantPaymentDatePage()
const paymentPlanPage: ClaimantPaymentPlanPage = new ClaimantPaymentPlanPage()
const courtOfferedSetDataPage: ClaimantCourtOfferedSetDatePage = new ClaimantCourtOfferedSetDatePage()
const courtOfferedInstalmentsPage: ClaimantCourtOfferedInstalmentsPage = new ClaimantCourtOfferedInstalmentsPage()
const payBySetDateAccepted: ClaimantPayBySetDateAcceptedPage = new ClaimantPayBySetDateAcceptedPage()
const viewDefendantsResponsePage: ClaimantDefendantResponsePage = new ClaimantDefendantResponsePage()
const settleAdmittedPage: ClaimantSettleAdmittedPage = new ClaimantSettleAdmittedPage()
const settleClaimPage: PaidInFullPage = new PaidInFullPage()
const directionsQuestionnaireSteps: DirectionsQuestionnaireSteps = new DirectionsQuestionnaireSteps()
const intentionToProceedSteps: ClaimantIntentionToProceedPage = new ClaimantIntentionToProceedPage()
const partPaymentReceivedPage: ClaimantPartPaymentReceivedPage = new ClaimantPartPaymentReceivedPage()
const claimantRejectionReasonPage: ClaimantRejectionReasonPage = new ClaimantRejectionReasonPage()
const claimantSettleClaimPage: ClaimantSettleClaimPage = new ClaimantSettleClaimPage()
const freeTelephoneMediationPage: FreeTelephoneMediationPage = new FreeTelephoneMediationPage()
const mediationDisagreementPage: MediationDisagreementPage = new MediationDisagreementPage()
const freeMediationPage: FreeMediationPage = new FreeMediationPage()
const howMediationWorksPage: HowMediationWorksPage = new HowMediationWorksPage()
const willYouTryMediationPage: WillYouTryMediationPage = new WillYouTryMediationPage()
const mediationAgreementPage: MediationAgreementPage = new MediationAgreementPage()
const canWeUsePage: CanWeUsePage = new CanWeUsePage()
const continueWithoutMediationPage: ContinueWithoutMediationPage = new ContinueWithoutMediationPage()
const tryFreeMediationPage: TryFreeMediationPage = new TryFreeMediationPage()

export class ClaimantResponseSteps {

  acceptSettlementFromDashboardWhenRejectPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptSettlementWithClaimantPaymentOption(testData, claimantResponseTestData)
  }

  acceptCourtOfferedRepaymentPlan (
    testData: EndToEndTestData,
    unReasonableClaimantResponseTestData: UnreasonableClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCourtOffer(testData, unReasonableClaimantResponseTestData)
  }

  acceptSettlementFromDashboardWhenAcceptPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptSettlement(testData, claimantResponseTestData)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJ(false)
  }

  acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod (
    testData: EndToEndTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJ(true)
  }

  acceptCcjFromDashboardWhenRejectPaymentMethod (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string
  ): void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    this.acceptCCJWithClaimantPaymentOption(false,testData,claimantResponseTestData)
  }

  viewClaimFromDashboard (claimRef: string): void {
    I.click('My account')
    I.see('Your money claims account')
    I.click(claimRef)
  }

  respondToOffer (buttonText: string): void {
    I.click(buttonText)
  }

  async reject (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): Promise<void> {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      viewDefendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETE')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedNo()
    }
    taskListPage.selectTaskFreeMediation()
    const isEnhacedMediationJourneyEnabled = await I.checkEnhancedMediationJourney()
    console.log('isEnhacedMediationJourneyEnabled value retrieved, attempt 1::',isEnhacedMediationJourneyEnabled)
    if (isEnhacedMediationJourneyEnabled) {
      console.log('new journey in persuit')
      console.log('inside acceptEnhancedMediationAfterDisagreeing')
      freeTelephoneMediationPage.chooseDisagree()
      console.log('chose disagree')
      mediationDisagreementPage.chooseYes()
      console.log('chose yes')
      canWeUsePage.chooseYes()
      console.log('chose yes')
      console.log('new journey complete')
    } else {
      console.log('old journey in persuit')
      console.log('inside - old acceptMediationAfterDisagreeing')
      if (process.env.FEATURE_MEDIATION === 'true') {
        console.log('Feature mediation is true')
        freeMediationPage.clickHowFreeMediationWorks()
        howMediationWorksPage.chooseContinue()
        willYouTryMediationPage.chooseYes()
        mediationAgreementPage.chooseDoNotAgree()
        continueWithoutMediationPage.chooseGoBack()
        mediationAgreementPage.chooseAgree()
        canWeUsePage.chooseYes()
      } else {
        console.log('Feature mediation is false')
        this.legacyFreeMediationReject()
      }
      console.log('old journey complete')
    }
    console.log('isEnhacedMediationJourneyEnabled value retrieved, attempt 2::',isEnhacedMediationJourneyEnabled)
    taskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  async decideToProceed (): Promise<void> {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    I.see('COMPLETE')
    I.click('Decide whether to proceed')
    I.see('Do you want to proceed with the claim?')
    intentionToProceedSteps.chooseYes()
    await this.finishClaimantResponse()
  }

  decideNotToProceed (): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    I.see('COMPLETE')
    I.click('Decide whether to proceed')
    I.see('Do you want to proceed with the claim?')
    intentionToProceedSteps.chooseNo()
    I.see('COMPLETE')
    I.click('Check and submit your response')
    I.see('Do you want to proceed with the claim?')
    I.see('No')
    I.click('input[type=submit]')
    I.see('You didn’t proceed with the claim')
  }

  async finishClaimantResponse (): Promise<void> {
    taskListPage.selectTaskFreeMediation()
    const isEnhacedMediationJourneyEnabled = await I.checkEnhancedMediationJourney()
    console.log('isEnhacedMediationJourneyEnabled value retrieved, attempt 1::',isEnhacedMediationJourneyEnabled)
    if (isEnhacedMediationJourneyEnabled) {
      console.log('new journey in persuit')
      console.log('inside acceptEnhancedMediationAfterDisagreeing')
      freeTelephoneMediationPage.chooseDisagree()
      console.log('chose disagree')
      mediationDisagreementPage.chooseYes()
      console.log('chose yes')
      canWeUsePage.chooseYes()
      console.log('chose yes')
      console.log('new journey complete')
    } else {
      console.log('old journey in persuit')
      console.log('inside - old acceptMediationAfterDisagreeing')
      if (process.env.FEATURE_MEDIATION === 'true') {
        console.log('Feature mediation is true')
        freeMediationPage.clickHowFreeMediationWorks()
        howMediationWorksPage.chooseContinue()
        willYouTryMediationPage.chooseYes()
        mediationAgreementPage.chooseDoNotAgree()
        continueWithoutMediationPage.chooseGoBack()
        mediationAgreementPage.chooseAgree()
        canWeUsePage.chooseYes()
      } else {
        console.log('Feature mediation is false')
        this.legacyFreeMediationReject()
      }
      console.log('old journey complete')
    }
    console.log('isEnhacedMediationJourneyEnabled value retrieved, attempt 2::',isEnhacedMediationJourneyEnabled)
    taskListPage.selectTaskHearingRequirements()
    console.log('isEnhacedMediationJourneyEnabled value retrieved, attempt 3::',isEnhacedMediationJourneyEnabled)
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  settleClaim (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData,
    buttonText: string)
    : void {
    this.viewClaimFromDashboard(testData.claimRef)
    this.respondToOffer(buttonText)
    settleClaimPage.enterDate(claimantResponseTestData.pageSpecificValues.settleClaimEnterDate)
    settleClaimPage.saveAndContinue()
  }

  acceptPartAdmitFromBusinessWithAlternativePaymentIntention (): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    viewDefendantsResponsePage.submitHowTheyWantToPay()
    I.see('COMPLETE')
    taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
    settleAdmittedPage.selectAdmittedYes()
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    paymentOptionPage.chooseFullBySetDate()
    paymentDatePage.enterDate('2024-01-01')
    paymentDatePage.saveAndContinue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptFullAdmitFromBusinessWithAlternativePaymentIntention (claimantResponseTestData: ClaimantResponseTestData): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    viewDefendantsResponsePage.submitHowTheyWantToPay()
    I.see('COMPLETE')
    taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
    settleAdmittedPage.selectAdmittedYes()
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    paymentOptionPage.chooseInstalments()
    paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
    paymentDatePage.saveAndContinue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptSettlement (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      viewDefendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETE')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedYes()
    }
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseYes()
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptSettlementWithClaimantPaymentOption (
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    if (claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      viewDefendantsResponsePage.submitHowTheyWantToPay()
    }
    I.see('COMPLETE')
    if (!testData.defendantClaimsToHavePaidInFull) {
      taskListPage.selectTaskAcceptOrRejectSpecificAmount(50)
      settleAdmittedPage.selectAdmittedYes()
    }
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    switch (testData.claimantPaymentOption) {
      case PaymentOption.IMMEDIATELY:
        paymentOptionPage.chooseImmediately()
        courtOfferedSetDataPage.accept()
        break
      case PaymentOption.BY_SET_DATE:
        paymentOptionPage.chooseFullBySetDate()
        paymentDatePage.enterDate(claimantResponseTestData.pageSpecificValues.paymentDatePageEnterDate)
        paymentDatePage.saveAndContinue()
        payBySetDateAccepted.continue()
        if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
          courtOfferedInstalmentsPage.accept()
        }
        break
      case PaymentOption.INSTALMENTS:
        paymentOptionPage.chooseInstalments()
        paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
        paymentPlanPage.saveAndContinue()
        payBySetDateAccepted.continue()
        break
      default:
        throw new Error(`Unknown payment option: ${testData.claimantPaymentOption}`)
    }
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptCourtOffer (
    testData: EndToEndTestData,
    unReasonableClaimantResponseTestData: UnreasonableClaimantResponseTestData
  ): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    if (unReasonableClaimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage) {
      viewDefendantsResponsePage.submitHowTheyWantToPay()
    }
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    paymentOptionPage.chooseInstalments()
    paymentPlanPage.enterRepaymentPlan(unReasonableClaimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
    paymentPlanPage.saveAndContinue()
    courtOfferedInstalmentsPage.checkingCourtOfferedPlanAndAccept()
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseSettlement()
    taskListPage.selectTaskSignASettlementAgreement()
    signSettlementAgreementPage.confirm()
    taskListPage.selectTaskCheckandSubmitYourResponse()
  }

  acceptCCJ (shouldPaySome: boolean): void {
    taskListPage.selectTaskViewDefendantResponse()
    I.click('Continue')
    I.see('COMPLETE')
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseYes()  // no is covered in settlement journey
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseRequestCcj()
    taskListPage.selectTaskRequestCountyCourtJudgment()
    if (shouldPaySome) {
      ccjPaidAnyMoneyPage.paidSome(10)
    } else {
      ccjPaidAnyMoneyPage.notPaidSome()
    }
    ccjPaidAmountSummaryPage.continue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
    checkAndSendPage.verifyFactsForCCJ()
    I.click('input[type=submit]')
  }

  acceptCCJWithClaimantPaymentOption (
    shouldPaySome: boolean,
    testData: EndToEndTestData,
    claimantResponseTestData: ClaimantResponseTestData
  ): void {
    I.dontSeeElement({ css: 'div.task-finished:not(.unfinished)>strong' })
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    taskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    acceptPaymentMethodPage.chooseNo()
    taskListPage.selectProposeAnAlternativeRepaymentPlan()
    switch (testData.claimantPaymentOption) {
      case PaymentOption.IMMEDIATELY:
        paymentOptionPage.chooseImmediately()
        courtOfferedSetDataPage.accept()
        break
      case PaymentOption.BY_SET_DATE:
        paymentOptionPage.chooseFullBySetDate()
        paymentDatePage.enterDate(claimantResponseTestData.pageSpecificValues.paymentDatePageEnterDate)
        paymentDatePage.saveAndContinue()
        payBySetDateAccepted.continue()
        if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
          courtOfferedInstalmentsPage.accept()
        }
        break
      case PaymentOption.INSTALMENTS:
        paymentOptionPage.chooseInstalments()
        paymentPlanPage.enterRepaymentPlan(claimantResponseTestData.pageSpecificValues.paymentPlanPageEnterRepaymentPlan)
        paymentPlanPage.saveAndContinue()
        payBySetDateAccepted.continue()
        if (claimantResponseTestData.isExpectingToSeeCourtOfferedInstalmentsPage) {
          courtOfferedInstalmentsPage.accept()
        }
        break
      default:
        throw new Error(`Unknown payment option: ${testData.claimantPaymentOption}`)
    }
    taskListPage.selectTaskChooseHowToFormaliseRepayment()
    chooseHowToProceedPage.chooseRequestCcj()
    taskListPage.selectTaskRequestCountyCourtJudgment()
    if (shouldPaySome) {
      ccjPaidAnyMoneyPage.paidSome(10)
    } else {
      ccjPaidAnyMoneyPage.notPaidSome()
    }
    ccjPaidAmountSummaryPage.continue()
    taskListPage.selectTaskCheckandSubmitYourResponse()
    checkAndSendPage.verifyFactsForCCJ()
    I.click('input[type=submit]')
  }

  acceptFullDefencePaidLessThanFullAmount (): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    I.see('COMPLETE')
    I.click('Have you been paid the ')
    partPaymentReceivedPage.yesTheDefendantHasPaid()
    I.see('Settle the claim for ')
    I.click('Settle the claim for')
    claimantSettleClaimPage.selectAcceptedYes()
    I.click('Check and submit your response')
    I.see('Do you agree the defendant has paid')
    I.see('Yes')
    I.see('Do you want to settle the claim for the')
    I.click('input[type=submit]')
    I.see('You’ve accepted their response')
  }

  rejectFullDefencePaidLessThanFullAmount (testData: EndToEndTestData): void {
    taskListPage.selectTaskViewDefendantResponse()
    viewDefendantsResponsePage.submit()
    I.see('COMPLETE')
    I.click('Have you been paid the £50')
    partPaymentReceivedPage.noTheDefendantHasNotPaid()
    taskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant()
    taskListPage.selectTaskCheckandSubmitYourResponse()
    checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType)
    I.see('You’ve rejected their response')
  }

  acceptFullDefencePaidFullAmount (testData: EndToEndTestData): void {
    taskListPage.selectTaskViewDefendantResponse()
    I.see(`${testData.defendantName} states they paid you £105.50.`)
    viewDefendantsResponsePage.submit()
    I.see('COMPLETE')
    I.click('Accept or reject their response')
    I.see(`Do you agree the defendant has paid the £105.50 in full?`)
    claimantSettleClaimPage.selectAcceptedYes()
    I.see('COMPLETE')
    I.click('Check and submit your response')
    I.see(`Do you agree the defendant has paid £105.50`)
    I.see('Yes')
    I.click('input[type=submit]')
    I.see('You’ve accepted their response')
    I.see('The claim is now settled.')
  }

  async rejectFullDefencePaidFullAmount (testData: EndToEndTestData): Promise<void> {
    taskListPage.selectTaskViewDefendantResponse()
    I.see(`${testData.defendantName} states they paid you £${claimAmount.getTotal()}`)
    viewDefendantsResponsePage.submit()
    I.see('COMPLETE')
    I.click('Accept or reject their response')
    I.see(`Do you agree the defendant has paid the £105.50 in full?`)
    claimantSettleClaimPage.selectAcceptedNo()
    I.see('Why did you reject their response')
    claimantRejectionReasonPage.enterReason('No money received')
    I.see('COMPLETE')
    await this.finishClaimantResponse()
    checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType)
    I.see('You’ve rejected their response')
  }

  legacyFreeMediationAccept (): void {
    console.log('inside legacyFreeMediationAccept')
    tryFreeMediationPage.chooseYes()
  }

  legacyFreeMediationReject (): void {
    console.log('inside legacyFreeMediationReject')
    tryFreeMediationPage.chooseNo()
  }
}
