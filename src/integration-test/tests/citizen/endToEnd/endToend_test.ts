import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from './data/EndToEndTestData'

const helperSteps: Helper = new Helper()

Feature('E2E tests for Claim and Defence response')

// Warning : Changing the text description of this scenario, could cause failure when running ZAP security test
Scenario('I can as an Individual make a claim against an Individual Without a defendant email address and are able to pay on the Gov Pay page @citizen @crossbrowser', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareDataWithNoDefendantEmail(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  helperSteps.finishResponse(testData, false, false)
})

Scenario('I can as Sole Trader make a claim against an Individual and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.SOLE_TRADER, PartyType.INDIVIDUAL)
  helperSteps.finishResponse(testData)
})

Scenario('I can as a Individual make a claim against a Company and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.INDIVIDUAL)
  helperSteps.finishResponse(testData)
})

Scenario('I can as a Company make a claim against a company and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.COMPANY, PartyType.COMPANY)
  helperSteps.finishResponse(testData)
})

Scenario('I can as a Organisation make a claim against an Individual and are able to pay on the Gov Pay page @nightly', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.ORGANISATION, PartyType.INDIVIDUAL)
  helperSteps.finishResponse(testData)
})
