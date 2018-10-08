import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'

import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { ClaimSteps } from '../claim/steps/claim'
import { PaidInFullSteps } from './steps/paidInFull'

const userSteps: UserSteps = new UserSteps()
const paidInFullSteps: PaidInFullSteps = new PaidInFullSteps()
const claimSteps: ClaimSteps = new ClaimSteps()

Feature('Claimant enter details of claim: date defendant paid').retry(3)

Scenario('Enter date defendant paid as claimant, with no defendant response @citizen @quick', async (I: I) => {
  const email: string = await I.createCitizenUser()
  claimSteps.makeAClaimAndSubmit(email, PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, true)
  userSteps.login(email)

  // click 'Tell us you've paid' on dashboard
  paidInFullSteps.DateClaimantReceivedMoney()
})
