import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { Helper } from 'integration-test/tests/citizen/endToEnd/steps/helper'
import { EndToEndTestData } from 'integration-test/tests/citizen/endToEnd/data/EndToEndTestData'
import { DefenceType } from 'integration-test/data/defence-type'
import { AppClient } from 'integration-test/helpers/clients/appClient'

const helperSteps: Helper = new Helper()

Feature('Respond to claim: online journey').retry(3)

Scenario('I can complete the journey when I fully reject the claim as I dispute the claim @citizen', async (I: I) => {
  const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  testData.defenceType = DefenceType.FULL_REJECTION_WITH_DISPUTE
  helperSteps.finishResponse(testData)
})

const isEnabled = async () => { return AppClient.isFeatureAdmissionsEnabled() }
if (isEnabled) {
  Scenario('I can fill out forms for I admit part of the claim @citizen @admissions', async (I: I) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.PART_ADMISSION
    helperSteps.finishResponse(testData)
  })

  Scenario('I can complete the journey when I fully reject the claim as I have already paid @citizen @admissions @debug', async (I: I) => {
    const testData = await EndToEndTestData.prepareData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
    testData.defenceType = DefenceType.FULL_REJECTION_BECAUSE_FULL_AMOUNT_IS_PAID
    helperSteps.finishResponse(testData)
    I.click('My account')
    I.see(testData.claimRef)
    I.see(`We’ve emailed ${testData.claimantName} telling them when and how you said you paid the claim`)
  })
}
