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
import { CannotPayImmediatelyPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/explain-why-cannot-pay-immediately'

const somStartPage: StartPage = new StartPage()
const somResidencePage: ResidencePage = new ResidencePage()
const somDependantsPage: DependantsPage = new DependantsPage()
const somMaintenancePage: MaintenancePage = new MaintenancePage()
const somEmploymentPage: EmploymentPage = new EmploymentPage()
const somBankAccountsPage: BankAccountsPage = new BankAccountsPage()
const somOtherDependantsPage: OtherDependantsPage = new OtherDependantsPage()
const somUnemploymentPage: UnemploymentPage = new UnemploymentPage()
const somDebtsPage: DebtsPage = new DebtsPage()
const somMonthlyIncomePage: MonthlyIncomePage = new MonthlyIncomePage()
const somMonthlyExpensesPage: MonthlyExpensesPage = new MonthlyExpensesPage()
const somCourtOrdersPage: CourtOrdersPage = new CourtOrdersPage()
const somCannotPayImmediatelyPage: CannotPayImmediatelyPage = new CannotPayImmediatelyPage()

export class StatementOfMeansSteps {

  fillStatementOfMeansData (): void {
    somStartPage.clickContinue()
    somBankAccountsPage.clickContinue()
    somResidencePage.selectOwnHome()
    somDependantsPage.selectDontHaveChildren()
    somMaintenancePage.selectDontPayMaintenance()
    somOtherDependantsPage.selectDontSupportAnyone()
    somEmploymentPage.selectNotWorkingCurrently()
    somUnemploymentPage.selectRetired()
    somDebtsPage.selectDontHaveDebts()
    somMonthlyIncomePage.fillOutAllFieldsAndContinue()
    somMonthlyExpensesPage.fillOutAllFieldsAndContinue()
    somCourtOrdersPage.selectDontHaveCourtOrders()
    somCannotPayImmediatelyPage.enterExplaination()
  }
}
