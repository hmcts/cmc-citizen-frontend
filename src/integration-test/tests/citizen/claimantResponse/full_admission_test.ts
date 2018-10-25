import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimantResponseSteps } from 'integration-test/tests/citizen/claimantResponse/steps/claimant-reponse'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { PaymentOption } from 'integration-test/data/payment-option'
import { ClaimantConfirmation } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-confirmation'
import { ClaimantCheckAndSendPage } from 'integration-test/tests/citizen/claimantResponse/pages/claimant-check-and-send'

const helperSteps: Helper = new Helper()
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const checkAndSendPage: ClaimantCheckAndSendPage = new ClaimantCheckAndSendPage()
const confirmationPage: ClaimantConfirmation = new ClaimantConfirmation()

Feature('Claimant Response') // .retry(3)

// TODO: reuse - similar to defence: full-admission-test
async function prepareClaim (I: I) {
  const claimantEmail: string = await I.createCitizenUser()
  const defendantEmail: string = await I.createCitizenUser()
  const claimData: ClaimData = createClaimData(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, claimantEmail)

  await helperSteps.enterPinNumber(claimRef, claimantEmail)

  return {
    'defendantEmail': defendantEmail,
    'claimantEmail': claimantEmail,
    'claimRef': claimRef
  }
}

Scenario('I can as a claimant view the defendants full admission with immediate payment @citizen', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.IMMEDIATELY)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(claim.claimRef, false)
  I.see(claim.claimRef)
  I.see('The defendant will pay you immediately')
  I.click('My account')
  I.see(claim.claimRef)
  I.see('The defendant admits they owe all the money. They’ve said that they will pay immediately.')
})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and accepting defendants payment method @citizen @debug-me', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenAcceptPaymentMethod(claim.claimRef)
  I.see('You’ve accepted the repayment plan')
  checkAndSendPage.verifyFactsForSettlement()
  checkAndSendPage.checkFactsTrueAndSubmit()
  confirmationPage.clickGoToYourAccount()
  I.see(claim.claimRef)
  I.see('You’ve signed the agreement')
})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of immediate payment @citizen @debug-me', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(claim.claimRef, PaymentOption.IMMEDIATELY)
  I.see('Error: (/usr/src/app/src/main/features/claimant-response/views/check-and-send.njk)')
  // checkAndSendPage.verifyFactsForSettlement()
  // checkAndSendPage.checkFactsTrueAndSubmit()
  // confirmationPage.clickGoToYourAccount()
  // I.see(claim.claimRef)
  // I.see('You’ve signed the agreement')
})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of set date @citizen @debug-me', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(claim.claimRef, PaymentOption.BY_SET_DATE)
  checkAndSendPage.verifyFactsForSettlement()
  checkAndSendPage.checkFactsTrueAndSubmit()
  I.see('Error: court calculated payment intention not found where decision type is CLAIMANT_IN_FAVOUR_OF_DEFENDANT')
  // confirmationPage.clickGoToYourAccount()
  // I.see(claim.claimRef)
  // I.see('You’ve signed the agreement')

})

Scenario('I can as a claimant accept the defendants full admission by set date with settlement agreement and rejecting defendants payment method in favour of instalments @citizen @debug-me1', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.acceptSettlementFromDashboardWhenRejectPaymentMethod(claim.claimRef, PaymentOption.INSTALMENTS)
  I.see('You’ve accepted the repayment plan')
  checkAndSendPage.verifyFactsForSettlement()
  checkAndSendPage.checkFactsTrueAndSubmit()
  confirmationPage.clickGoToYourAccount()
  I.see(claim.claimRef)
  I.see('You’ve signed the agreement')
})

Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and no previous payments made @citizen', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidNoneAndAcceptPaymentMethod(claim.claimRef)
  I.see(claim.claimRef)
  I.see('You requested a County Court Judgment')
})

Scenario('I can as a claimant accept the defendants full admission by set date with CCJ and a previous payment made @citizen', async (I: I) => {
  const claim = await prepareClaim(I)
  // as defendant
  helperSteps.finishResponseWithFullAdmission(claim.claimRef, claim.defendantEmail, PartyType.INDIVIDUAL, PaymentOption.BY_SET_DATE)
  I.click('Sign out')
  // as claimant
  userSteps.login(claim.claimantEmail)
  claimantResponseSteps.acceptCcjFromDashboardWhenDefendantHasPaidSomeAndAcceptPaymentMethod(claim.claimRef)
  I.see(claim.claimRef)
  I.see('You requested a County Court Judgment')
})
