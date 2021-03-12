import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from '../../../data/payment-option'
import { UserSteps } from '../home/steps/user'
import { ClaimantResponseSteps } from '../claimantResponse/steps/claimant-reponse'
import { DefenceType } from '../../../data/defence-type'
import { ClaimantResponseTestData } from '../claimantResponse/data/ClaimantResponseTestData'
import { ClaimantCheckAndSendPage } from '../claimantResponse/pages/claimant-check-and-send'
import { ClaimantConfirmation } from '../claimantResponse/pages/claimant-confirmation'
import { EndToEndTestData } from './data/EndToEndTestData'
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const helperSteps: Helper = new Helper()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()
let testData

Feature('Part Admission E2E')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.COMPANY)
})

Scenario(' Company Rejected Part Admit Offer (Company Vs Company) @nightly @admissions', { retries: 3 }, async (I: I) => {
  testData.paymentOption = PaymentOption.IMMEDIATELY
  testData.defenceType = DefenceType.PART_ADMISSION
  testData.defendantClaimsToHavePaidInFull = false
  const claimantResponseTestData = new ClaimantResponseTestData()
  claimantResponseTestData.isExpectingToSeeHowTheyWantToPayPage = true
  // as defendant
  await helperSteps.finishResponse(testData, false)
  I.click('Sign out')
  // as claimant
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  claimantResponseSteps.respondToOffer('View and respond')
  claimantResponseSteps.reject(testData, claimantResponseTestData)
  checkAndSendPage.verifyFactsForPartAdmitRejection()
  checkAndSendPage.checkFactsTrueAndSubmit(testData.defenceType)
  I.see('You agreed to try to resolve the claim using mediation')
  confirmationPage.clickGoToYourAccount()
  I.see(testData.claimRef)
})
