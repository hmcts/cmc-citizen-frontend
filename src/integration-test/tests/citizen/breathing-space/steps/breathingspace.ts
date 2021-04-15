import { DoYouHaveBsReferenceNumberPage } from 'integration-test/tests/citizen/breathing-space/pages/do-you-have-bs-refrence-number'
import { WhenDidBsStartPage } from 'integration-test/tests/citizen/breathing-space/pages/when-did-bs-start'
import { WhatTypeBsPage } from 'integration-test/tests/citizen/breathing-space/pages/what-type-bs'
import { ExpectedBsEndDatePage } from 'integration-test/tests/citizen/breathing-space/pages/expected-bs-enddate'
import { CheckYourAnswersBeforeSubmittingPage } from 'integration-test/tests/citizen/breathing-space/pages/check-your-answers-before-submitting'
import { DateForLiftingBsPage } from 'integration-test/tests/citizen/breathing-space/pages/date-for-lifting-bs'
import { LiftBsCheckYourAnswersPage } from 'integration-test/tests/citizen/breathing-space/pages/lift-bs-check-your-answers'


const doYouHaveBsReferenceNumberPage: DoYouHaveBsReferenceNumberPage = new DoYouHaveBsReferenceNumberPage()
const whenDidBsStartPage: WhenDidBsStartPage = new WhenDidBsStartPage()
const whatTypeBsPage: WhatTypeBsPage = new WhatTypeBsPage()
const expectedBsEndDatePage: ExpectedBsEndDatePage = new ExpectedBsEndDatePage()
const checkYourAnswersBeforeSubmittingPage: CheckYourAnswersBeforeSubmittingPage = new CheckYourAnswersBeforeSubmittingPage()
const dateForLiftingBsPage: DateForLiftingBsPage = new DateForLiftingBsPage()
const liftBsCheckYourAnswersPage: LiftBsCheckYourAnswersPage = new LiftBsCheckYourAnswersPage()

export class BreathingSpaceSteps {

  enterBreathingSpace (): void {
    if (process.env.FEATURE_BREATHING_SPACE === 'true') {
      doYouHaveBsReferenceNumberPage.enterReferenceNumber('1234567890')
      whenDidBsStartPage.enterBsStartDate('2020-01-01')
      whatTypeBsPage.selectBsType()
      expectedBsEndDatePage.expectedEndDate('2099-08-08')
      checkYourAnswersBeforeSubmittingPage.submitBreathingSpace()
    }
  }

  liftBreathingSpace (): void {
    if (process.env.FEATURE_BREATHING_SPACE === 'true') {
      dateForLiftingBsPage.dateLifted('2020-04-04')
      liftBsCheckYourAnswersPage.submitLiftBreathingSpace()
    }
  }
}
