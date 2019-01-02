import { expect } from 'chai'

import { ViewSendCompanyFinancialDetailsTask } from 'response/tasks/viewSendCompanyFinancialDetailsTask'
import { ResponseDraft } from 'response/draft/responseDraft'

describe('ViewSendCompanyFinancialDetailsTask', () => {
  describe('isCompleted', () => {
    const draft = new ResponseDraft()

    it('should return true when send company details financial details has been viewed by defendant', () => {
      draft.companyDefendantResponseViewed = true
      expect(ViewSendCompanyFinancialDetailsTask.isCompleted(draft)).to.equal(true)
    })

    it('should return false when send company details financial details has not been viewed by defendant (false)', () => {
      draft.companyDefendantResponseViewed = false
      expect(ViewSendCompanyFinancialDetailsTask.isCompleted(draft)).to.equal(false)
    })

    it('should return false when send company details financial details has not been viewed by defendant (undefined)', () => {
      draft.companyDefendantResponseViewed = undefined
      expect(ViewSendCompanyFinancialDetailsTask.isCompleted(undefined)).to.equal(false)
    })
  })
})
