import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'

const helperSteps: Helper = new Helper()

Feature('Respond to claim: online journey')

Scenario('I can complete the journey when I fully reject the claim as I dispute the claim @citizen', { retries: 3 }, async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
  helperSteps.finishResponse(testData)
  I.click('My account')
  I.see(testData.claimRef)
  I.see(`Wait for the claimant to respond`)
})

if (process.env.FEATURE_ADMISSIONS === 'true') {
  Scenario('I can fill out forms for I admit part of the claim @nightly @admissions', { retries: 3 }, async (I: I) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.PART_ADMISSION
    helperSteps.finishResponse(testData)
    I.click('My account')
    I.see(testData.claimRef)
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`)
  })

  Scenario('I can complete the journey when I fully reject the claim as I have already paid @citizen @admissions', { retries: 3 }, async (I: I) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID
    helperSteps.finishResponse(testData)
    I.click('My account')
    I.see(testData.claimRef)
    I.click(testData.claimRef)
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`)
  })
}
