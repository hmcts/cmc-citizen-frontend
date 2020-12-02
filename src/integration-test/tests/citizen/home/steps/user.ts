import { IdamClient } from 'integration-test/helpers/clients/idamClient'
import { DEFAULT_PASSWORD, UserEmails } from 'integration-test/data/test-data'
import { ClaimantTaskListPage } from 'integration-test/tests/citizen/claim/pages/claimant-task-list'
import { LoginPage } from 'integration-test/tests/citizen/home/pages/login'

const loginPage: LoginPage = new LoginPage()
const taskListPage: ClaimantTaskListPage = new ClaimantTaskListPage()
const userEmails: UserEmails = new UserEmails()

export class UserSteps {

  getClaimantEmail (): string {
    return userEmails.getClaimant()
  }

  getDefendantEmail (): string {
    return userEmails.getDefendant()
  }

  login (username: string): void {
    loginPage.open()
    loginPage.login(username, DEFAULT_PASSWORD)
  }

  async prepareAuthenticatedUser (userEmail: string): Promise<void> {
    const jwt: string = await IdamClient.authenticateUser(userEmail)
    const user: User = await IdamClient.retrieveUser(jwt)
    user.roles.push('letter-1')
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
