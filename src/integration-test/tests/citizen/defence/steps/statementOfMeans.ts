import { DependantsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/dependants'
import { EducationPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/education'
import { EmployersPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/employers'
import { EmploymentPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/employment'
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
import { DisabilityPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/disability'
import { PartnerPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/partner'
import { CarerPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/carer'
import { PartnerAgePage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/partnerAge'
import { PartnerPensionPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/partnerPension'
import { PartnerDisabilityPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/partnerDisability'
import { PartnerSevereDisabilityPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/partnerSevereDisability'
import { SevereDisabilityPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/severeDisability'
import { PriorityDebtsPage } from 'integration-test/tests/citizen/defence/pages/statement-of-means/priorityDebts'

const startPage: StartPage = new StartPage()
const bankAccountsPage: BankAccountsPage = new BankAccountsPage()
const disabilityPage: DisabilityPage = new DisabilityPage()
const severeDisabilityPage: SevereDisabilityPage = new SevereDisabilityPage()
const residencePage: ResidencePage = new ResidencePage()
const cohabitingPage: PartnerPage = new PartnerPage()
const partnerAgePage: PartnerAgePage = new PartnerAgePage()
const partnerPensionPage: PartnerPensionPage = new PartnerPensionPage()
const partnerDisabilityPage: PartnerDisabilityPage = new PartnerDisabilityPage()
const partnerSevereDisabilityPage: PartnerSevereDisabilityPage = new PartnerSevereDisabilityPage()
const dependantsPage: DependantsPage = new DependantsPage()
const educationPage: EducationPage = new EducationPage()
const otherDependantsPage: OtherDependantsPage = new OtherDependantsPage()
const carerPage: CarerPage = new CarerPage()
const employmentPage: EmploymentPage = new EmploymentPage()
const employersPage: EmployersPage = new EmployersPage()
const selfEmploymentPage: SelfEmploymentPage = new SelfEmploymentPage()
const onTaxPaymentsPage: OnTaxPaymentsPage = new OnTaxPaymentsPage()
const unemploymentPage: UnemploymentPage = new UnemploymentPage()
const incomePage: MonthlyIncomePage = new MonthlyIncomePage()
const expensesPage: MonthlyExpensesPage = new MonthlyExpensesPage()
const debtsPage: DebtsPage = new DebtsPage()
const priorityDebtsPage: PriorityDebtsPage = new PriorityDebtsPage()
const courtOrdersPage: CourtOrdersPage = new CourtOrdersPage()
const explanationPage: ExplanationPage = new ExplanationPage()

export class StatementOfMeansSteps {

  fillStatementOfMeansWithMinimalDataSet (amount?: string): void {
    startPage.clickContinue()
    bankAccountsPage.enterBankAccount('Current account', false, 1000)
    bankAccountsPage.clickContinue()
    disabilityPage.selectNoOption()
    residencePage.selectOwnHome()
    residencePage.clickContinue()
    cohabitingPage.selectNoOption()
    dependantsPage.selectNotDeclared()
    dependantsPage.clickContinue()
    otherDependantsPage.selectNotDeclared()
    otherDependantsPage.clickContinue()
    carerPage.selectNoOption()
    employmentPage.selectNotDeclared()
    employmentPage.clickContinue()
    unemploymentPage.selectRetired()
    unemploymentPage.clickContinue()
    courtOrdersPage.selectNotDeclared()
    courtOrdersPage.clickContinue()
    priorityDebtsPage.clickContinue()
    debtsPage.selectNotDeclared()
    debtsPage.clickContinue()
    expensesPage.fillOutSomeFields()
    expensesPage.clickContinue()
    incomePage.fillOutSomeFields(amount)
    incomePage.clickContinue()
    explanationPage.enterExplanation('I cannot pay immediately')
    explanationPage.clickContinue()
  }

  fillStatementOfMeansWithFullDataSet (): void {
    startPage.clickContinue()
    bankAccountsPage.enterBankAccount('Saving account', true, 10000)
    bankAccountsPage.clickContinue()
    disabilityPage.selectYesOption()
    severeDisabilityPage.selectYesOption()
    residencePage.selectOther('Special home')
    residencePage.clickContinue()
    cohabitingPage.selectYesOption()
    partnerAgePage.selectYesOption()
    partnerPensionPage.selectYesOption()
    partnerDisabilityPage.selectYesOption()
    partnerSevereDisabilityPage.selectYesOption()
    dependantsPage.selectDeclared()
    dependantsPage.enterNumberOfChildren(1, 2, 3)
    dependantsPage.clickContinue()
    educationPage.enterNumberOfChildren(3)
    educationPage.clickContinue()
    // dependant disability page is skipped
    otherDependantsPage.selectDeclared()
    otherDependantsPage.enterNumberOfPeople(5, 'Colleagues')
    otherDependantsPage.clickContinue()
    // carer page is skipped
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
    courtOrdersPage.selectDeclared()
    courtOrdersPage.enterCourtOrder('000MC001', 100, 10)
    courtOrdersPage.clickContinue()
    priorityDebtsPage.declareMortgage(500)
    priorityDebtsPage.declareMaintenance(200)
    priorityDebtsPage.clickContinue()
    debtsPage.selectDeclared()
    debtsPage.enterDebt('Wife\'s debt', 100, 10)
    debtsPage.clickContinue()
    expensesPage.fillOutSomeFields()
    expensesPage.clickContinue()
    incomePage.fillOutSomeFields()
    incomePage.clickContinue()
    explanationPage.enterExplanation('I cannot pay immediately')
    explanationPage.clickContinue()
  }
}
