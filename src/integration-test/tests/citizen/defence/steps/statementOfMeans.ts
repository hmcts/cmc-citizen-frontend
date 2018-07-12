import { DependantsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/dependants'
import { EducationPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/education'
import { EmployersPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/employers'
import { EmploymentPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/employment'
import { MaintenancePage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/maintenance'
import { OnTaxPaymentsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/on-tax-payments'
import { ResidencePage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/residence'
import { SelfEmploymentPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/self-employment'
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
const educationPage: EducationPage = new EducationPage()
const maintenancePage: MaintenancePage = new MaintenancePage()
const otherDependantsPage: OtherDependantsPage = new OtherDependantsPage()
const employmentPage: EmploymentPage = new EmploymentPage()
const employersPage: EmployersPage = new EmployersPage()
const selfEmploymentPage: SelfEmploymentPage = new SelfEmploymentPage()
const onTaxPaymentsPage: OnTaxPaymentsPage = new OnTaxPaymentsPage()
const unemploymentPage: UnemploymentPage = new UnemploymentPage()
const incomePage: MonthlyIncomePage = new MonthlyIncomePage()
const expensesPage: MonthlyExpensesPage = new MonthlyExpensesPage()
const debtsPage: DebtsPage = new DebtsPage()
const courtOrdersPage: CourtOrdersPage = new CourtOrdersPage()
const explanationPage: ExplanationPage = new ExplanationPage()

export class StatementOfMeansSteps {

  fillStatementOfMeansWithMinimalDataSet (): void {
    startPage.clickContinue()
    bankAccountsPage.enterBankAccount('Current account', false, 1000)
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
    incomePage.fillOutSomeFields()
    incomePage.clickContinue()
    expensesPage.fillOutAllFields()
    expensesPage.clickContinue()
    courtOrdersPage.selectNotDeclared()
    courtOrdersPage.clickContinue()
    explanationPage.enterExplanation('I cannot pay immediately')
    explanationPage.clickContinue()
  }

  fillStatementOfMeansWithFullDataSet (): void {
    startPage.clickContinue()
    bankAccountsPage.enterBankAccount('Saving account', true, 10000)
    bankAccountsPage.clickContinue()
    residencePage.selectOther('Special home')
    residencePage.clickContinue()
    dependantsPage.selectDeclared()
    dependantsPage.enterNumberOfChildren(1, 2, 3)
    dependantsPage.clickContinue()
    educationPage.enterNumberOfChildren(3)
    educationPage.clickContinue()
    maintenancePage.selectDeclared()
    maintenancePage.enterNumberOfChildren(4)
    maintenancePage.clickContinue()
    otherDependantsPage.selectDeclared()
    otherDependantsPage.enterNumberOfPeople(5, 'Colleagues')
    otherDependantsPage.clickContinue()
    employmentPage.selectDeclared()
    employmentPage.tickEmployed()
    employmentPage.tickSelfEmployed()
    employmentPage.clickContinue()
    employersPage.enterDetails('Happy Dogs and Cats', 'Junior Accountant')
    employersPage.clickContinue()
    selfEmploymentPage.enterDetails('CEO', 1000)
    selfEmploymentPage.clickContinue()
    onTaxPaymentsPage.selectDeclared()
    onTaxPaymentsPage.enterDetails(100, 'Various taxes')
    onTaxPaymentsPage.clickContinue()
    debtsPage.selectDeclared()
    debtsPage.enterDebt('Wife\'s debt', 100, 10)
    debtsPage.clickContinue()
    incomePage.fillOutSomeFields()
    incomePage.clickContinue()
    expensesPage.fillOutAllFields()
    expensesPage.clickContinue()
    courtOrdersPage.selectDeclared()
    courtOrdersPage.enterCourtOrder('000MC001', 100, 10)
    courtOrdersPage.clickContinue()
    explanationPage.enterExplanation('I cannot pay immediately')
    explanationPage.clickContinue()
  }
}
