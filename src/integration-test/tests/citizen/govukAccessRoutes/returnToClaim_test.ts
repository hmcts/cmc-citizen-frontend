import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'
import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()

Feature('GovUK access routes - return to claim')

Scenario('I can enter a CCBC reference and get sent to MCOL', function* (I: I) {
  accessRoutesSteps.returnToClaimMcol()
})

Scenario('I can enter a moneyclaims reference and login to see the dashboard', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const claimRef = yield I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)
  accessRoutesSteps.returnToClaimMoneyClaims(claimRef, claimantEmail)
})

Scenario('I can select don’t have a claim number and choose to go to moneyclaims, login and see the dashboard', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  accessRoutesSteps.dontHaveAReferenceMoneyClaims(claimantEmail)
})

Scenario('I can select don’t have a claim number and choose to go to MCOL', function* (I: I) {
  accessRoutesSteps.dontHaveAReferenceMcol()
})


