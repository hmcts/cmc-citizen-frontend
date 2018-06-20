import { DependantsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/dependants'
import { EmploymentPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/employment'
import { MaintenancePage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/maintenance'
import { ResidencePage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/residence'
import { StartPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/start'
import { BankAccountsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/bankAccounts'
import { OtherDependantsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/other-dependants'
import { UnemploymentPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/unemployment'
import { DebtsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/debts'
import { CourtOrdersPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/courtOrders'
import { MonthlyIncomePage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/monthlyIncome'
import { MonthlyExpensesPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/monthlyExpenses'
import { ExplanationPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/explanation'

const startPage: StartPage = new StartPage()
const bankAccountsPage: BankAccountsPage = new BankAccountsPage()
const residencePage: ResidencePage = new ResidencePage()
const dependantsPage: DependantsPage = new DependantsPage()
const maintenancePage: MaintenancePage = new MaintenancePage()
const otherDependantsPage: OtherDependantsPage = new OtherDependantsPage()
const employmentPage: EmploymentPage = new EmploymentPage()
const unemploymentPage: UnemploymentPage = new UnemploymentPage()
const incomePage: MonthlyIncomePage = new MonthlyIncomePage()
const expensesPage: MonthlyExpensesPage = new MonthlyExpensesPage()
const debtsPage: DebtsPage = new DebtsPage()
const courtOrdersPage: CourtOrdersPage = new CourtOrdersPage()
const explanationPage: ExplanationPage = new ExplanationPage()

export class StatementOfMeansSteps {

  fillStatementOfMeans (): void {
    startPage.clickContinue()
    bankAccountsPage.addBankAccount()
    bankAccountsPage.clickContinue()
    residencePage.selectOwnHome()
    residencePage.clickContinue()
    dependantsPage.selectNotDeclared()
    dependantsPage.clickContinue()
    maintenancePage.selectNotDeclared()
    maintenancePage.clickContinue()
    otherDependantsPage.selectNotDeclared()
    otherDependantsPage.clickContinue()
    employmentPage.selectNotDeclared()
    employmentPage.clickContinue()
    unemploymentPage.selectRetired()
    unemploymentPage.clickContinue()
    debtsPage.selectNotDeclared()
    debtsPage.clickContinue()
    incomePage.fillOutAllFields()
    incomePage.clickContinue()
    expensesPage.fillOutAllFields()
    expensesPage.clickContinue()
    courtOrdersPage.selectNotDeclared()
    courtOrdersPage.clickContinue()
    explanationPage.enterExplanation()
    explanationPage.clickContinue()
  }
}
