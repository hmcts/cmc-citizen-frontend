import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import I = CodeceptJS.I
import { AccessRoutesSteps } from 'integration-test/tests/citizen/govukAccessRoutes/steps/accessRoutesSteps'

const accessRoutesSteps: AccessRoutesSteps = new AccessRoutesSteps()

Feature('GovUK access routes - respond to claim')

Scenario('I can enter a CCBC reference and get sent to MCOL', function* (I: I) {
  accessRoutesSteps.respondToClaimMcol()
})

Scenario('I can enter a moneyclaims reference and get sent to enter a pin', function* (I: I) {
  const claimantEmail: string = yield I.createCitizenUser()
  const claimRef = yield I.createClaim(createClaimData(PartyType.SOLE_TRADER, PartyType.INDIVIDUAL), claimantEmail)

  accessRoutesSteps.respondToClaimMoneyClaims(claimRef)
})
