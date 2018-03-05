import { ClaimantInterestPage } from 'integration-test/tests/citizen/claim/pages/claimant-interest'
import { ClaimantInterestDatePage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-date'
import { ClaimantInterestTotalPage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-total'

const claimantInterestPage: ClaimantInterestPage = new ClaimantInterestPage()
const claimantInterestDatePage: ClaimantInterestDatePage = new ClaimantInterestDatePage()
const claimantInterestTotalPage: ClaimantInterestTotalPage = new ClaimantInterestTotalPage()

export class InterestSteps {

  skipClaimInterest (): void {
    claimantInterestPage.selectNoClaimInterest()
  }

  enterDefaultInterest (): void {
    claimantInterestPage.selectStandardRate()
    claimantInterestDatePage.selectDefaultDate()
  }

  enterSpecificInterestRateAndDate (rate: number, date: string): void {
    claimantInterestPage.selectDifferentRate(rate)
    claimantInterestDatePage.selectParticularDate(date)
  }

  skipClaimantInterestTotalPage (): void {
    claimantInterestTotalPage.continue()
  }
}
