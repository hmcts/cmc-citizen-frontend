import I = CodeceptJS.I
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import { InterestSteps } from 'integration-test/tests/citizen/claim/steps/interest'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { PartyType } from 'integration-test/data/party-type'

const userSteps: UserSteps = new UserSteps()
const claimSteps: ClaimSteps = new ClaimSteps()
const interestSteps: InterestSteps = new InterestSteps()

Feature('Claimant Enter details of claim')

Scenario('I can prepare a claim with default interest @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  userSteps.login(email)
  claimSteps.completeEligibility()
  claimSteps.optIntoNewFeatures()
  userSteps.selectClaimAmount()
  I.see('Claim amount')
  claimSteps.enterClaimAmount(10, 20.50, 50)
  I.see('£80.50')
  claimSteps.claimantTotalAmountPageRead()
  I.see('Do you want to claim interest?')
  interestSteps.enterDefaultInterest()
  I.see('Total amount you’re claiming')
  interestSteps.skipClaimantInterestTotalPage()
  I.see('Prepare your claim')
}).retry(3)

Scenario('I can prepare a claim with no interest @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  userSteps.login(email)

  claimSteps.completeEligibility()
  claimSteps.optIntoNewFeatures()
  userSteps.selectClaimAmount()
  I.see('Claim amount')
  claimSteps.enterClaimAmount(10, 20.50, 50)
  I.see('£80.50')
  claimSteps.claimantTotalAmountPageRead()
  I.see('Do you want to claim interest?')
  interestSteps.skipClaimInterest()
  I.see('Total amount you’re claiming')
  interestSteps.skipClaimantInterestTotalPage()
  I.see('Prepare your claim')
}).retry(3)

Scenario('I can prepare a claim with different interest rate and date @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  userSteps.login(email)

  claimSteps.completeEligibility()
  claimSteps.optIntoNewFeatures()
  userSteps.selectClaimAmount()
  claimSteps.enterClaimAmount(10, 20.50, 50)
  I.see('£80.50')
  claimSteps.claimantTotalAmountPageRead()
  I.see('Do you want to claim interest?')
  interestSteps.enterSpecificInterestRateAndDate(2, '1990-01-01')
  I.see('Total amount you’re claiming')
  interestSteps.skipClaimantInterestTotalPage()
  I.see('Prepare your claim')
}).retry(3)

Scenario('I can prepare a claim with a manually entered interest amount and a daily amount added @citizen', async (I: I) => {
  const email: string = await I.createCitizenUser()
  userSteps.login(email)

  claimSteps.completeEligibility()
  claimSteps.optIntoNewFeatures()
  userSteps.selectClaimAmount()
  claimSteps.enterClaimAmount(10, 20.50, 50)
  I.see('£80.50')
  claimSteps.claimantTotalAmountPageRead()
  I.see('Do you want to claim interest?')
  interestSteps.enterBreakdownInterestAmountAndDailyAmount()
  I.see('Total amount you’re claiming')
  interestSteps.skipClaimantInterestTotalPage()
  I.see('Prepare your claim')
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user

Scenario('I can enter a claim details and navigate up to payment page @smoke-test', (I: I) => {
  claimSteps.makeAClaimAndNavigateUpToPayment(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, true, false)
}).retry(3)
