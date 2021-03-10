import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()
let claimantEmail
let claimRef

Feature('GovUK Access Routes - Return & Respond To Claim E2E')

Before(async (I: I) => {
  claimantEmail = await I.getClaimantEmail()
  claimRef = await I.createClaim(await createClaimData(I, PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)

})

Scenario('I can enter a moneyclaims reference and login to see the dashboard @citizen', { retries: 3 }, async (I: I) => {
  accessRoutesSteps.returnToClaimMoneyClaims(claimRef, claimantEmail)
})

Scenario('I can select don’t have a claim number and choose to go to moneyclaims, login and see the dashboard @citizen @nightly', { retries: 3 }, async (I: I) => {
  accessRoutesSteps.dontHaveAReferenceMoneyClaims(claimantEmail)
})

Scenario('I can enter a moneyclaims reference and get sent to enter a pin @citizen @nightly', { retries: 3 }, async (I: I) => {
  accessRoutesSteps.respondToClaimMoneyClaims(claimRef)
})
