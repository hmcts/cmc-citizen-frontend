/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { DraftClaimantResponse } from 'claimant-response/draft/draftClaimantResponse'
import { SettleAdmittedTask } from 'claimant-response/tasks/settleAdmittedTask'
import { YesNoOption } from 'models/yesNoOption'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'

describe('SettleAdmittedTask', () => {
  it('should not be completed when settle admitted object is undefined', () => {
    const draft = new DraftClaimantResponse()
    draft.settleAdmitted = undefined

    expect(SettleAdmittedTask.isCompleted(draft)).to.be.false
  })

  it('should not be completed when settle admitted option is not selected', () => {
    const draft = new DraftClaimantResponse()
    draft.settleAdmitted = new SettleAdmitted(undefined)

    expect(SettleAdmittedTask.isCompleted(draft)).to.be.false
  })

  it('should be completed when settle admitted option is selected', () => {
    YesNoOption.all().forEach(option => {
      const draft = new DraftClaimantResponse()
      draft.settleAdmitted = new SettleAdmitted(option)

      expect(SettleAdmittedTask.isCompleted(draft)).to.be.true
    })
  })
})
