import { ClaimantInterestDatePage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-date'
import { ClaimantInterestTotalPage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-total'
import { ClaimantInterestPage } from 'integration-test/tests/citizen/claim/pages/claimant-interest'
import { ClaimantInterestTypePage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-type'
import { ClaimantInterestRatePage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-rate'
import { ClaimantInterestStartDatePage } from 'integration-test/tests/citizen/claim/pages/claimant-interest-start-date'

const claimantInterestPage: ClaimantInterestPage = new ClaimantInterestPage()
const claimantInterestTypePage: ClaimantInterestTypePage = new ClaimantInterestTypePage()
const claimantInterestRatePage: ClaimantInterestRatePage = new ClaimantInterestRatePage()
const claimantInterestDatePage: ClaimantInterestDatePage = new ClaimantInterestDatePage()
const claimantInterestTotalPage: ClaimantInterestTotalPage = new ClaimantInterestTotalPage()
const claimantInterestStartDatePage: ClaimantInterestStartDatePage = new ClaimantInterestStartDatePage()

export class InterestSteps {

  skipClaimInterest (): void {
    claimantInterestPage.selectNo()
  }

  enterDefaultInterest (): void {
    claimantInterestPage.selectYes()
    claimantInterestTypePage.selectSameRate()
    claimantInterestRatePage.selectStandardRate()
    claimantInterestDatePage.selectSubmission()
  }

  enterSpecificInterestRateAndDate (rate: number, date: string): void {
    claimantInterestPage.selectYes()
    claimantInterestTypePage.selectSameRate()
    claimantInterestRatePage.selectDifferent('10', 'Contract')
    claimantInterestDatePage.selectCustom()
    claimantInterestStartDatePage.selectParticularDate('2018-01-01', 'Contract')
  }

  skipClaimantInterestTotalPage (): void {
    claimantInterestTotalPage.continue()
  }
}
