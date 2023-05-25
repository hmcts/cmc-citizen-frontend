import { DEFAULT_PASSWORD } from 'integration-test/data/test-data'
import { ClaimantTaskListPage } from 'integration-test/tests/citizen/claim/pages/claimant-task-list'
import { LoginPage } from 'integration-test/tests/citizen/home/pages/login'

const loginPage: LoginPage = new LoginPage()
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
