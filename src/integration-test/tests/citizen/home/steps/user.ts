import { DEFAULT_PASSWORD } from 'integration-tests/data/test-data'
import { ClaimantStartClaimPage } from 'integration-tests/tests/citizen/claim/pages/claimant-start-claim'
import { ClaimantTaskListPage } from 'integration-tests/tests/citizen/claim/pages/claimant-task-list'
import { LoginPage } from 'integration-tests/tests/citizen/home/pages/login'

const loginPage: LoginPage = new LoginPage()
const startClaimPage: ClaimantStartClaimPage = new ClaimantStartClaimPage()
const taskListPage: ClaimantTaskListPage = new ClaimantTaskListPage()

export class UserSteps {

  login (username: string): void {
    loginPage.open()
    loginPage.login(username, DEFAULT_PASSWORD)
  }

  loginWithPreRegisteredUser (username: string, password: string): void {
    loginPage.open()
    loginPage.login(username,password)
  }

  startClaim (): void {
    startClaimPage.open()
    startClaimPage.startClaim()
  }

  selectResolvingThisDispute (): void {
    taskListPage.selectTaskResolvingThisDispute()
  }

  selectCompletingYourClaim (): void {
    taskListPage.selectTaskCompletingYourClaim()
  }

  selectYourDetails (): void {
    taskListPage.selectTaskYourDetails()
  }

  selectTheirDetails (): void {
    taskListPage.selectTaskTheirDetails()
  }

  selectClaimAmount (): void {
    taskListPage.selectTaskClaimAmount()
  }

  selectClaimDetails (): void {
    taskListPage.selectTaskClaimDetails()
  }

  selectCheckAndSubmitYourClaim (): void {
    taskListPage.selectTaskCheckAndSubmitYourClaim()
  }
}
