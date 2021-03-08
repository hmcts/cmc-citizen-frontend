import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import { createClaimData } from 'integration-test/data/test-data'
import { CountyCourtJudgementSteps } from 'integration-test/tests/citizen/ccj/steps/ccj'

import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const userSteps: UserSteps = new UserSteps()
const ccjSteps: CountyCourtJudgementSteps = new CountyCourtJudgementSteps()
let email
let claimantType
let defendantType
let claimData
let claimRef

Feature('Default CCJ E2E Tests')

Before(async (I: I) => {
  email = await I.getClaimantEmail()
  claimantType = PartyType.INDIVIDUAL
  defendantType = PartyType.INDIVIDUAL

  claimData = await createClaimData(I, claimantType, defendantType, true, InterestType.NO_INTEREST)
  claimRef = await I.createClaim(claimData, email)

})

Scenario('Default CCJ E2E...@nightly @citizen', { retries: 3 }, async (I: I) => {
  userSteps.login(email)
  await ccjSteps.requestCCJWhenDefendantNotPaid(I, claimRef, defendantType)
  ccjSteps.ccjDefendantToPayImmediately()
  ccjSteps.validateCheckAndSendPageAnswers(claimantType, claimData.defendants[0], defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})

Scenario('CCJ requested with no defendant email... @citizen @nightly', { retries: 3 }, async (I: I) => {
  userSteps.login(email)
  await ccjSteps.requestCCJ(I, claimRef, defendantType)
  ccjSteps.ccjDefendantToPayByInstalments()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, claimData.defendants[0], defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})
