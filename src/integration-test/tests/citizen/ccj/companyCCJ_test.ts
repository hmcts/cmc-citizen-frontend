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

Feature('Limited Company Requested CCJ')

Before(async (I: I) => {
  email = await I.getClaimantEmail()
  claimantType = PartyType.ORGANISATION
  defendantType = PartyType.SOLE_TRADER

  claimData = await createClaimData(I, claimantType, defendantType, true, InterestType.NO_INTEREST)
  claimRef = await I.createClaim(claimData, email)

})

if (process.env.CUI_DASHBOARD_REDIRECT !== 'true') {
  Scenario('Company Requested CCJ(Company Vs Sole Trader) @citizen @nightly', {retries: 3}, async (I: I) => {
    userSteps.login(email)
    await ccjSteps.requestCCJ(I, claimRef, defendantType)
    ccjSteps.ccjDefendantToPayBySetDate()
    ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, claimData.defendants[0], defendantType)
    I.see('County Court Judgment requested', 'h1.bold-large')
  })
}
