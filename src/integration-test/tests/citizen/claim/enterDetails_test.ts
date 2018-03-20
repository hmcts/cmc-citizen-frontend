import I = CodeceptJS.I
import { ClaimantClaimAmountPage } from 'integration-test/tests/citizen/claim/pages/claimant-claim-amount'
import { ClaimSteps } from 'integration-test/tests/citizen/claim/steps/claim'
import { InterestSteps } from 'integration-test/tests/citizen/claim/steps/interest'
import { UserSteps } from 'integration-test/tests/citizen/home/steps/user'
import { PartyType } from 'integration-test/data/party-type'

const userSteps: UserSteps = new UserSteps()
const claimSteps: ClaimSteps = new ClaimSteps()
const interestSteps: InterestSteps = new InterestSteps()
const claimantClaimAmountPage: ClaimantClaimAmountPage = new ClaimantClaimAmountPage()

Feature('Claimant Enter details of claim')

Scenario('I can prepare a claim with default interest @citizen', function* (I: I) {
  const email: string = yield I.createCitizenUser()
  userSteps.login(email)
  userSteps.startClaim()
  claimSteps.completeEligibility()
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
})

Scenario('I can prepare a claim with no interest @citizen', function* (I: I) {
  const email: string = yield I.createCitizenUser()
  userSteps.login(email)

  userSteps.startClaim()
  claimSteps.completeEligibility()
  userSteps.selectClaimAmount()
  I.see('Claim amount')
  claimSteps.enterClaimAmount(10, 20.50, 50)
  I.see('£80.50')
  claimSteps.claimantTotalAmountPageRead()
  I.see('Interest')
  interestSteps.skipClaimInterest()
  I.see('Total amount you’re claiming')
  interestSteps.skipClaimantInterestTotalPage()
  I.see('Prepare your claim')
})

Scenario('I can prepare a claim with different interest rate and date @citizen', function* (I: I) {
  const email: string = yield I.createCitizenUser()
  userSteps.login(email)

  userSteps.startClaim()
  claimSteps.completeEligibility()
  userSteps.selectClaimAmount()
  claimSteps.enterClaimAmount(10, 20.50, 50)
  I.see('£80.50')
  claimSteps.claimantTotalAmountPageRead()
  I.see('Interest')
  interestSteps.enterSpecificInterestRateAndDate(2, '1990-01-01')
  I.see('Total amount you’re claiming')
  interestSteps.skipClaimantInterestTotalPage()
  I.see('Prepare your claim')
})

Scenario('I can see the Claim amount page calculates properly and shows the correct fees table @citizen', function* (I: I) {
  const email: string = yield I.createCitizenUser()
  userSteps.login(email)

  userSteps.startClaim()
  claimSteps.completeEligibility()
  userSteps.selectClaimAmount()
  I.see('Claim amount')
  claimantClaimAmountPage.enterAmount(11, 20.50, 32.25)
  claimantClaimAmountPage.calculateTotal()
  I.see('£63.75')
  I.click('Save and continue')
  I.see('Interest')
  interestSteps.skipClaimInterest()
  I.see('Fees you’ll pay')
  I.see('How these fees are calculated')
  I.click('summary')
  I.see('Claim amount Claim fee Hearing fee')
  I.see('£0.01 to £300.00 £25.00 £25.00')
  I.see('£300.01 to £500.00 £35.00 £55.00')
  I.see('£500.01 to £1,000.00 £60.00 £80.00')
  I.see('£1,000.01 to £1,500.00 £70.00 £115.00')
  I.see('£1,500.01 to £3,000.00 £105.00 £170.00')
  I.see('£3,000.01 to £5,000.00 £185.00 £335.00')
  I.see('£5,000.01 to £10,000.00 £410.00 £335.00')
})

// The @citizen-smoke-test tag used for running smoke tests with pre-registered user

Scenario('I can enter a claim details and navigate up to payment page @citizen-smoke-test', function* (I: I) {
  claimSteps.makeAClaimAndNavigateUpToPayment(PartyType.INDIVIDUAL, PartyType.INDIVIDUAL, true)
})
