import I = CodeceptJS.I
import { UpdateResponseDeadlinePage } from 'integration-tests/tests/citizen/testingSupport/pages/update-response-deadline'

const I: I = actor()
const updateResponseDeadline: UpdateResponseDeadlinePage = new UpdateResponseDeadlinePage()

export class TestingSupportSteps {

  makeClaimAvailableForCCJ (claimRef: string): void {
    I.click('Testing support')
    I.click('Update response deadline')
    updateResponseDeadline.updateDeadline(claimRef, '2000-01-01')
  }
}
