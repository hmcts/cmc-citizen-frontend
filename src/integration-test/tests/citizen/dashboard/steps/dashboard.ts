import I = CodeceptJS.I
import { ClaimantDashboardPage } from 'integration-test/tests/citizen/dashboard/pages/claimant'
import { DashboardPage } from 'integration-test/tests/citizen/dashboard/pages/dashboard'

const I: I = actor()
const dashboardPage: DashboardPage = new DashboardPage()
const claimantPage: ClaimantDashboardPage = new ClaimantDashboardPage()

export class DashboardSteps {

  startCCJ (claimRef: string): void {
    I.click('My account')
    dashboardPage.selectClaim(claimRef)
    claimantPage.clickRequestCCJ()
  }
}
