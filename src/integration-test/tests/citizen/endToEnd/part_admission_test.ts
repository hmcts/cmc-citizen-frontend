import I = CodeceptJS.I
import { createClaimData } from 'integration-test/data/test-data'
import { PartyType } from 'integration-test/data/party-type'
import { PaymentOption } from 'integration-test/data/payment-option'
import { DefenceType } from '../../../data/defence-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { DefenceSteps } from 'integration-test/tests/citizen/defence/steps/defence'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from '../claimantResponse/steps/claimant-reponse'
import { DashboardPage } from '../dashboard/pages/dashboard'
import { ClaimantDashboardPage } from '../dashboard/pages/claimant'
import { ClaimantTaskListPage } from '../claimantResponse/pages/claimant-task-list'
import { ClaimantDefendantResponsePage } from '../claimantResponse/pages/claimant-defendant-response'
import { ClaimantSettleAdmittedPage } from '../claimantResponse/pages/claimant-settle-admitted'
import { ClaimantCheckAndSendPage } from '../claimantResponse/pages/claimant-check-and-send'
import { ClaimantConfirmation } from '../claimantResponse/pages/claimant-confirmation'
import { DirectionsQuestionnaireSteps } from '../directionsQuestionnaire/steps/directionsQuestionnaireSteps'
import { DefendantDashboardPage } from '../dashboard/pages/defendant'
import { ClaimantAcceptPaymentMethod } from '../claimantResponse/pages/claimant-accept-payment-method'
import { ClaimantChooseHowToProceed } from '../claimantResponse/pages/claimant-choose-how-to-proceed'
import { ClaimantSignSettlementAgreement } from '../claimantResponse/pages/claimant-sign-settlement-agreement'
import { DefendantSignSettlementAgreement } from '../defence/pages/defendant-sign-settlement-agreement'
import { DefendantSignSettlementAgreementConfirmation } from '../defence/pages/defendant-sign-settlement-agreement-confirmation'

const helperSteps: Helper = new Helper()
const defenceSteps: DefenceSteps = new DefenceSteps()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const dashboardPage: DashboardPage = new DashboardPage()
const claimantDashboardPage: ClaimantDashboardPage = new ClaimantDashboardPage()
const claimantTaskListPage: ClaimantTaskListPage = new ClaimantTaskListPage()
const claimantDefendantResponsePage: ClaimantDefendantResponsePage = new ClaimantDefendantResponsePage()
const claimantSettleAdmittedPage: ClaimantSettleAdmittedPage = new ClaimantSettleAdmittedPage()
const claimantCheckAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const claimantConfirmation: ClaimantConfirmation = new ClaimantConfirmation()
const directionsQuestionnaireSteps: DirectionsQuestionnaireSteps = new DirectionsQuestionnaireSteps()
const defendantDashboardPage: DefendantDashboardPage = new DefendantDashboardPage()
const claimantAcceptPaymentMethod: ClaimantAcceptPaymentMethod = new ClaimantAcceptPaymentMethod()
const claimantChooseHowToProceed: ClaimantChooseHowToProceed = new ClaimantChooseHowToProceed()
const claimantSignSettlementAgreement: ClaimantSignSettlementAgreement = new ClaimantSignSettlementAgreement()
const defendantSignSettlementAgreement: DefendantSignSettlementAgreement = new DefendantSignSettlementAgreement()
const defendantSignSettlementAgreementConfirmation: DefendantSignSettlementAgreementConfirmation = new DefendantSignSettlementAgreementConfirmation()

async function prepareClaim (I: I) {
  const claimantEmail: string = userSteps.getClaimantEmail()
  const defendantEmail: string = userSteps.getDefendantEmail()

  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)
  helperSteps.linkClaimToDefendant(defendantEmail)
  helperSteps.startResponseFromDashboard(claimRef)

  return { data: claimData, claimRef: claimRef }
}

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Feature('Partially admit the claim')

  Scenario('I can complete the journey when I partially admit the claim with payment already made @citizen @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentMade(PartyType.INDIVIDUAL)
  })

  Scenario('I can complete the journey when I partially admit the claim with immediate payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
  })

  Scenario('I can complete the journey when I partially admit the claim with by set date payment @citizen @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  })

  Scenario('I can complete the journey when I partially admit the claim with instalments payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
  })

  Scenario('I can complete the journey when I partially admit the claim with immediate payment and claimant accept the payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
    const claimantEmail: string = userSteps.getClaimantEmail()
    dashboardPage.logout()
    claimantResponseSteps.loginAsClaimant(claimantEmail)
    dashboardPage.selectClaim(claimData.claimRef)
    claimantDashboardPage.clickViewAndRespond()
    claimantTaskListPage.selectTaskViewDefendantResponse()
    claimantDefendantResponsePage.submit()
    claimantTaskListPage.selectTaskAcceptOrRejectSpecificAmount(10)
    claimantSettleAdmittedPage.selectAdmittedYes()
    claimantTaskListPage.selectTaskCheckandSubmitYourResponse()
    claimantCheckAndSendPage.verifyFactsForPartAdmitAcceptance()
    claimantCheckAndSendPage.submitNoDq()
    claimantConfirmation.verifyAcceptanceConfirmation()
    claimantConfirmation.clickGoToYourAccount()
  })

  Scenario('I can complete the journey when I partially admit the claim with immediate payment and claimant reject the payment @nightly @admissions', { retries: 3 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
    const claimantEmail: string = userSteps.getClaimantEmail()
    const defendantEmail: string = userSteps.getDefendantEmail()
    dashboardPage.logout()
    claimantResponseSteps.loginAsClaimant(claimantEmail)
    dashboardPage.selectClaim(claimData.claimRef)
    claimantDashboardPage.clickViewAndRespond()
    claimantTaskListPage.selectTaskViewDefendantResponse()
    claimantDefendantResponsePage.submit()
    claimantTaskListPage.selectTaskAcceptOrRejectSpecificAmount(10)
    claimantSettleAdmittedPage.selectAdmittedNo()
    claimantTaskListPage.selectTaskHearingRequirements()
    directionsQuestionnaireSteps.acceptDirectionsQuestionnaireNoJourneyAsClaimant()
    claimantTaskListPage.selectTaskCheckandSubmitYourResponse()
    claimantCheckAndSendPage.verifyFactsForPartAdmitRejection()
    claimantCheckAndSendPage.checkFactsTrueAndSubmit(DefenceType.PART_ADMISSION)
    claimantConfirmation.verifyRejectionConfirmation(DefenceType.PART_ADMISSION)
    claimantConfirmation.clickGoToYourAccount()
    dashboardPage.logout()
    defenceSteps.loginAsDefendant(defendantEmail)
    dashboardPage.selectClaim(claimData.claimRef)
    defendantDashboardPage.verifyPartAdmitRejectStatus(claimData.data.claimants[0].name, 10)
  })

  Scenario('I can complete the journey when I partially admit the claim with installments and claimant accept the repayment plan with settlement agreement @nightly @admissions', { retries: 1 }, async (I: I) => {
    const claimData = await prepareClaim(I)
    defenceSteps.makePartialAdmission(claimData.data.defendants[0])
    defenceSteps.partialPaymentNotMade(PartyType.INDIVIDUAL, PaymentOption.INSTALMENTS)
    const claimantEmail: string = userSteps.getClaimantEmail()
    const defendantEmail: string = userSteps.getDefendantEmail()
    dashboardPage.logout()
    claimantResponseSteps.loginAsClaimant(claimantEmail)
    dashboardPage.selectClaim(claimData.claimRef)
    claimantDashboardPage.clickViewAndRespond()
    claimantTaskListPage.selectTaskViewDefendantResponse()
    claimantDefendantResponsePage.submitHowTheyWantToPay()
    claimantTaskListPage.selectTaskAcceptOrRejectSpecificAmount(10)
    claimantSettleAdmittedPage.selectAdmittedYes()
    claimantTaskListPage.selectTaskAcceptOrRejectTheirRepaymentPlan()
    claimantAcceptPaymentMethod.chooseYes()
    claimantTaskListPage.selectTaskChooseHowToFormaliseRepayment()
    claimantChooseHowToProceed.chooseSettlement()
    claimantTaskListPage.selectTaskSignASettlementAgreement()
    claimantSignSettlementAgreement.confirm()
    claimantTaskListPage.selectTaskCheckandSubmitYourResponse()
    claimantCheckAndSendPage.verifyFactsForPartAdmitAcceptance()
    claimantCheckAndSendPage.submitNoDq()
    claimantConfirmation.verifyAcceptanceSettlementConfirmation()
    claimantConfirmation.clickGoToYourAccount()
    dashboardPage.logout()
    defenceSteps.loginAsDefendant(defendantEmail)
    dashboardPage.selectClaim(claimData.claimRef)
    defendantDashboardPage.verifySettlementAggrement(claimData.data.claimants[0].name)
    defendantDashboardPage.clickViewTheRepaymentPlane()
    defendantSignSettlementAgreement.confirm()
    defendantSignSettlementAgreementConfirmation.verifyAcceptanceConfirmation()
  })
}
