import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'
import { PaymentOption } from '../../../data/payment-option'
import { UserSteps } from '../home/steps/user'
import { ClaimantResponseSteps } from '../claimantResponse/steps/claimant-reponse'
const userSteps: UserSteps = new UserSteps()
const claimantResponseSteps: ClaimantResponseSteps = new ClaimantResponseSteps()
const helperSteps: Helper = new Helper()

let testData

Feature('Full Admission E2E')

Before(async (I: I) => {
  testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.COMPANY)
})

Scenario('Company agreed to pay all of the claim @nightly @citizen', { retries: 3 }, async (I: I) => {
  testData.paymentOption = PaymentOption.IMMEDIATELY
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.see('The defendant said they’ll pay you immediately')
  I.click('My account')
  I.see(testData.claimRef)
})

Scenario('Self Employed Person agreed(Sole Trader Vs Individual) to pay all of the claim... @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.SOLE_TRADER, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.click('My account')
  I.see(testData.claimRef)
})

Scenario('Organization agreed (Organization Vs Individual) to pay all of the claim... @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.ORGANISATION, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.click('My account')
  I.see(testData.claimRef)
})

Scenario('Defendant agreed(Individual Vs Individual) to pay all of the claim... @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.click('My account')
  I.see(testData.claimRef)
})

Scenario('Organization agreed to pay all of the claim to sole trader... @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.ORGANISATION, PartyType.SOLE_TRADER)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.click('My account')
  I.see(testData.claimRef)
})

Scenario('Company agreed to pay all of the claim  to individual @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.INDIVIDUAL)
  testData.paymentOption = PaymentOption.IMMEDIATELY
  helperSteps.finishResponseWithFullAdmission(testData)
  I.click('Sign out')
  userSteps.login(testData.claimantEmail)
  claimantResponseSteps.viewClaimFromDashboard(testData.claimRef)
  I.see(testData.claimRef)
  I.click('My account')
  I.see(testData.claimRef)
})

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Scenario('Admit all of the claim with PCQ... @citizen @admissions', { retries: 3 }, async (I: I) => {
    testData.paymentOption = PaymentOption.INSTALMENTS
    helperSteps.finishResponseWithFullAdmission(testData)
  })
}
