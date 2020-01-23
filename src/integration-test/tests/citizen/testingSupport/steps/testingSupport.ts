import I = CodeceptJS.I
import { CreateClaimDraftPage } from 'integration-test/tests/citizen/testingSupport/pages/create-claim-draft'
import { UpdateResponseDeadlinePage } from 'integration-test/tests/citizen/testingSupport/pages/update-response-deadline'

const I: I = actor()
const updateResponseDeadlinePage: UpdateResponseDeadlinePage = new UpdateResponseDeadlinePage()
const createClaimDraftPage: CreateClaimDraftPage = new CreateClaimDraftPage()

export class TestingSupportSteps {

  makeClaimAvailableForCCJ (claimRef: string): void {
    I.click('Testing support')
    I.click('Update response deadline')
    updateResponseDeadlinePage.updateDeadline(claimRef, '2000-01-01')
  }

  createClaimDraft (): void {
    I.click('Testing support')
    I.click('Create Claim Draft')
    createClaimDraftPage.createClaimDraft()
  }

  deleteClaimDraft (): void {
    I.click('Testing support')
    I.click('Delete Drafts')
    I.click('Delete claim draft')
  }
}
