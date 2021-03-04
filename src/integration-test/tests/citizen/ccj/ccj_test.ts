import I = CodeceptJS.I
import { PartyType } from 'integration-test/data/party-type'
import { InterestType } from 'integration-test/data/interest-type'
import { createClaimData } from 'integration-test/data/test-data'
import { CountyCourtJudgementSteps } from 'integration-test/tests/citizen/ccj/steps/ccj'

import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'

const userSteps: UserSteps = new UserSteps()
const ccjSteps: CountyCourtJudgementSteps = new CountyCourtJudgementSteps()

Feature('CCJ')

Scenario('Request judgment as an individual with no defendant email and pay by instalments @citizen @quick', { retries: 3 },
  async (I: I) => {
    const email: string = await I.getClaimantEmail()
    const claimantType: PartyType = PartyType.INDIVIDUAL
    const defendantType: PartyType = PartyType.INDIVIDUAL
    const hasDefendantEmail = false
    const claimData = await createClaimData(I, claimantType, defendantType, hasDefendantEmail, InterestType.NO_INTEREST)
    const claimRef: string = await I.createClaim(claimData, email)

    userSteps.login(email)
    await ccjSteps.requestCCJ(I, claimRef, defendantType)
    ccjSteps.ccjDefendantToPayByInstalments()
    ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, claimData.defendants[0], defendantType)
    I.see('County Court Judgment requested', 'h1.bold-large')
  })

Scenario('Request judgment as a Company, pay by set date @nightly', { retries: 3 }, async (I: I) => {
  const email: string = await I.getClaimantEmail()
  const claimantType: PartyType = PartyType.COMPANY
  const defendantType: PartyType = PartyType.COMPANY

  const claimData = await createClaimData(I, claimantType, defendantType, true, InterestType.NO_INTEREST)
  const claimRef: string = await I.createClaim(claimData, email)

  userSteps.login(email)
  await ccjSteps.requestCCJ(I, claimRef, defendantType)
  ccjSteps.ccjDefendantToPayBySetDate()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, claimData.defendants[0], defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})

Scenario('Request judgment as a sole trader, pay immediately @nightly', { retries: 3 }, async (I: I) => {
  const email: string = await I.getClaimantEmail()
  const claimantType: PartyType = PartyType.SOLE_TRADER
  const defendantType: PartyType = PartyType.ORGANISATION

  const claimData = await createClaimData(I, claimantType, defendantType, true, InterestType.NO_INTEREST)
  const claimRef: string = await I.createClaim(claimData, email)

  userSteps.login(email)
  await ccjSteps.requestCCJ(I, claimRef, defendantType)
  ccjSteps.ccjDefendantToPayImmediately()
  ccjSteps.checkCCJFactsAreTrueAndSubmit(claimantType, claimData.defendants[0], defendantType)
  I.see('County Court Judgment requested', 'h1.bold-large')
})
