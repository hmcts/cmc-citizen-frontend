/* tslint:disable:no-unused-expression */
import { expect } from 'chai'

import { SettleAdmittedTask } from 'claimant-response/tasks/settleAdmittedTask'
import { YesNoOption } from 'models/yesNoOption'
import { SettleAdmitted } from 'claimant-response/form/models/settleAdmitted'

describe('SettleAdmittedTask', () => {
  it('should not be completed when settle admitted object is undefined', () => {
    expect(SettleAdmittedTask.isCompleted(undefined)).to.be.false
  })

  it('should not be completed when settle admitted option is not selected', () => {
    expect(SettleAdmittedTask.isCompleted(new SettleAdmitted(undefined))).to.be.false
  })

  it('should be completed when settle admitted option is selected', () => {
    YesNoOption.all().forEach(option => {
      expect(SettleAdmittedTask.isCompleted(new SettleAdmitted(option))).to.be.true
    })
  })
})
