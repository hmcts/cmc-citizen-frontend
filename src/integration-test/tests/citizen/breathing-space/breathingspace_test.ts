import { PartyType } from 'integration-test/data/party-type'
import { createClaimData } from 'integration-test/data/test-data'
import { BreathingSpaceSteps } from 'integration-test/tests/citizen/breathing-space/steps/breathingspace'
import I = CodeceptJS.I

import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const userSteps: UserSteps = new UserSteps()
const breathingSpaceSteps: BreathingSpaceSteps = new BreathingSpaceSteps()

Feature('Enter and Lift BreathingSpace')

Scenario('I can as a claimant Enter and lift the Breathing Space @smoke', { retries: 3 }, async (I: I) => {
  const email: string = await I.getClaimantEmail()
  const claimData: ClaimData = await createClaimData(I, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL)
  const claimRef: string = await I.createClaim(claimData, email)
  userSteps.login(email)
  I.waitForOpenClaim(claimRef)
  I.click('My account')
  I.see('Your money claims account')
  I.click(claimRef)
  I.see('Claim number:')
  I.see('Notify us about the debt respite scheme')
  I.click('Notify us about the debt respite scheme')
  breathingSpaceSteps.enterBreathingSpace()
  I.see('Lift the debt respite scheme')
  I.click('Lift the debt respite scheme')

})
