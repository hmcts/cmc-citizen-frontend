import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import { createClaimData } from 'integration-test/data/test-data'
import { BreathingSpaceSteps } from 'integration-test/tests/citizen/breathing-space/steps/breathingspace'
import I = CodeceptJS.I

import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const userSteps: UserSteps = new UserSteps()
const breathingSpaceSteps: BreathingSpaceSteps = new BreathingSpaceSteps()
let email
let claimantType
let defendantType
let claimData
let claimRef

Feature('citizen frontend claimant journey for Breathing space')

Before(async (I: I) => {
  email = await I.getClaimantEmail()
  claimantType = PartyType.INDIVIDUAL
  defendantType = PartyType.ORGANISATION
  claimData = await createClaimData(I, claimantType, defendantType, true, InterestType.NO_INTEREST)
  claimRef = await I.createClaim(claimData, email)

})

Scenario('Claimant can enter and lift the Breathing space @smoke-test @nightly', { retries: 3 }, async (I: I) => {
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
  breathingSpaceSteps.liftBreathingSpace()

})
