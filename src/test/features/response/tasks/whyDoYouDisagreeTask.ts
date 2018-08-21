/* tslint:disable:no-unused-expression */
import { expect } from 'chai'
import { WhyDoYouDisagree } from 'response/form/models/whyDoYouDisagree'
import { WhyDoYouDisagreeTask } from 'response/tasks/whyDoYouDisagreeTask'

const validText = 'valid'

describe('WhyDoYouDisagreeTask', () => {
  context('should not be completed when', () => {
    it('whyDoYouDisagree is undefined', () => {
      expect(WhyDoYouDisagreeTask.isCompleted(undefined)).to.be.false
    })

    it('text is undefined', () => {
      expect(WhyDoYouDisagreeTask.isCompleted(new WhyDoYouDisagree(undefined))).to.be.false
    })

    it('text is empty', () => {
      expect(WhyDoYouDisagreeTask.isCompleted(new WhyDoYouDisagree(''))).to.be.false
    })
  })

  it('should be completed when whyDoYouDisagree is valid', () => {
    expect(WhyDoYouDisagreeTask.isCompleted(new WhyDoYouDisagree(validText))).to.be.true
  })
})
