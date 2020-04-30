import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()
const userSteps: UserSteps = new UserSteps()

Feature('GovUK access routes - return to claim')

Scenario('I can enter a CCBC reference and get sent to MCOL @nightly', { retries: 3 }, (I: I) => {
  accessRoutesSteps.returnToClaimMcol()
})

Scenario('I can enter a moneyclaims reference and login to see the dashboard @citizen', { retries: 3 }, async (I: I, loginAs) => {
  const claimantEmail: string = userSteps.getClaimantEmail()
  const claimRef = await I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)
  accessRoutesSteps.returnToClaimMoneyClaims(claimRef)
  await I.loggedInAs(await loginAs('claimant').then(() => 'Claimant'))
  accessRoutesSteps.checkDashboard()

})

Scenario('I can select don’t have a claim number and choose to go to moneyclaims, login and see the dashboard @nightly', { retries: 3 }, async (I: I, loginAs) => {
  const claimantEmail: string = userSteps.getClaimantEmail()
  await I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)
  await accessRoutesSteps.dontHaveAReferenceMoneyClaims()
  await I.loggedInAs(await loginAs('claimant').then(() => 'Claimant'))
  accessRoutesSteps.checkDashboard()
})

Scenario('I can select don’t have a claim number and choose to go to MCOL @nightly', { retries: 3 }, (I: I) => {
  accessRoutesSteps.dontHaveAReferenceMcol()
})
