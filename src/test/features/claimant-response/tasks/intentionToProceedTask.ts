/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { IntentionToProceedTask } from 'claimant-response/tasks/intentionToProceedTask'
import { IntentionToProceed } from 'claimant-response/form/models/intentionToProceed'
import { YesNoOption } from 'models/yesNoOption'

describe('IntentionToProceedTask', () => {
  it('should not be completed when object is undefined', () => {
    expect(IntentionToProceedTask.isCompleted(undefined)).to.be.false
  })

  it('should not be completed when option is not selected', () => {
    expect(IntentionToProceedTask.isCompleted(new IntentionToProceed(undefined))).to.be.false
  })

  it('should be completed when option is Yes', () => {
    expect(IntentionToProceedTask.isCompleted(new IntentionToProceed(YesNoOption.YES))).to.be.true
  })

  it('should be completed when option is No', () => {
    expect(IntentionToProceedTask.isCompleted(new IntentionToProceed(YesNoOption.NO))).to.be.true
  })
})
