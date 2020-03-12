import { RoutablePath } from 'shared/router/routablePath'

export class Paths {
  static readonly homePage = new RoutablePath('/', false)
  static readonly webchat = new RoutablePath('/webchat', false)
  static readonly resolveBeforeClaimPage = new RoutablePath('/resolve-before-claim', false)
  static readonly receiver = new RoutablePath('/receiver', false)
  static readonly linkDefendantReceiver = new RoutablePath('/receiver/link-defendant', false)
  static readonly logoutReceiver = new RoutablePath('/logout', false)
  static readonly privacyPolicyPage = new RoutablePath('/privacy-policy', false)
  static readonly cookiesPage = new RoutablePath('/cookies', false)
  static readonly termsAndConditionsPage = new RoutablePath('/terms-and-conditions', false)
  static readonly contactUsPage = new RoutablePath('/contact-us', false)
  static readonly accessibilityPage = new RoutablePath('/accessibility-statement', false)

  // Ajax endpoints
  static readonly postcodeLookupProxy = new RoutablePath('/postcode-lookup', false)
  static readonly paymentPlanCalculation = new RoutablePath('/payment-plan-calculation', false)
  static readonly totalIncomeOrExpensesCalculation = new RoutablePath('/total-income-expense-calculation',false)

  // gov.uk entrypoints - these can't change without updating gov.uk content as well
  static readonly makeClaimReceiver = new RoutablePath('/make-claim', false)
  static readonly respondToClaimReceiver = new RoutablePath('/respond-to-claim', false)
  static readonly returnToClaimReceiver = new RoutablePath('/return-to-claim', false)

  static readonly enterClaimNumberPage = new RoutablePath('/enter-claim-number', false)
  static readonly noClaimNumberPage = new RoutablePath('/no-claim-number', false)

}
