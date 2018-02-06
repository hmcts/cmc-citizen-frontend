import { expect } from 'chai'

import * as sinon from 'sinon'

import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { ResponseDraft } from 'response/draft/responseDraft'
import { TaskList } from 'drafts/tasks/taskList'
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { LocalDate } from 'forms/models/localDate'
import { MomentFactory } from 'common/momentFactory'
import { Claim } from 'claims/models/claim'
import { Individual } from 'app/claims/models/details/theirs/individual'

const claim = {
  responseDeadline: MomentFactory.currentDateTime(),
  externalId: undefined,
  claimData: {
    defendant: new Individual()
  }
} as Claim

describe('Defendant response task list builder', () => {
  describe('"Respond to claim" section', () => {
    describe('"Free mediation" task', () => {
      let stub: sinon.SinonStub

      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'requireMediation')
      })

      afterEach(() => {
        stub.restore()
      })

      it('should be enabled when mediation is available', () => {
        stub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Free mediation')
      })

      it('should be disabled when mediation is not available', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Free mediation')
      })
    })

    describe('"How much have you paid the claimant" task', () => {
      let stub: sinon.SinonStub

      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyRejectedDueTo')
      })

      afterEach(() => {
        stub.restore()
      })

      it('should be enabled when claim is partially rejected due to amount being paid by claimant', () => {
        stub.withArgs(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED).returns(true)

        const input = {
          howMuchIsPaid: {
            amount: 300,
            date: new LocalDate(20, 1, 12),
            text: 'I owe nothing'
          }
        }
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('How much have you paid the claimant?')
      })

      it('should be disabled in remaining cases', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('How much have you paid the claimant?')
      })
    })

    describe('"When did you pay" task', () => {
      let requireWhenDidYouPayStub: sinon.SinonStub

      beforeEach(() => {
        requireWhenDidYouPayStub = sinon.stub(ResponseDraft.prototype, 'requireWhenDidYouPay')
      })

      afterEach(() => {
        requireWhenDidYouPayStub.restore()
      })

      it('should be enabled when claim is fully rejected due to amount being paid and claimed', () => {
        requireWhenDidYouPayStub.returns(true)

        const input = {
          whenDidYouPay: {
            date: new LocalDate(20, 1, 12),
            text: 'I paid cash'
          }
        }
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('When did you pay?')
      })

      it('should be disabled in remaining cases', () => {
        requireWhenDidYouPayStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('When did you pay?')
      })
    })

    describe('"Check and submit your response" task', () => {
      let requireSubmissionStub: sinon.SinonStub

      beforeEach(() => {
        requireSubmissionStub = sinon.stub(ResponseDraft.prototype, 'requireSubmission')
      })

      afterEach(() => {
        requireSubmissionStub.restore()
      })

      it('should be enabled when claim is fully rejected due to amount being paid and claimed', () => {
        requireSubmissionStub.returns(true)

        const input = {
          whenDidYouPay: {
            date: new LocalDate(20, 1, 12),
            text: 'I paid cash'
          }
        }
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
        const taskList: TaskList = TaskListBuilder.buildSubmitSection(responseDraft, '400f4c57-9684-49c0-adb4-4cf46579d6dc')
        expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')
      })

      it('should undefined remaining cases', () => {
        requireSubmissionStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildSubmitSection(new ResponseDraft(), '400f4c57-9684-49c0-adb4-4cf46579d6dc')
        expect(taskList).to.be.eq(undefined)
      })
    })

    describe('"When will you pay" task', () => {
      let isResponseFullyAdmittedStub: sinon.SinonStub
      let isResponsePartiallyRejectedDueToStub: sinon.SinonStub

      beforeEach(() => {
        isResponseFullyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmitted')
        isResponsePartiallyRejectedDueToStub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyRejectedDueTo')
      })

      afterEach(() => {
        isResponseFullyAdmittedStub.restore()
        isResponsePartiallyRejectedDueToStub.restore()
      })

      it('should be enabled when claim is fully admitted', () => {
        isResponseFullyAdmittedStub.returns(true)
        isResponsePartiallyRejectedDueToStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('When will you pay?')
      })

      it('should be enabled when claim is partially rejected due to amount being too high', () => {
        isResponseFullyAdmittedStub.returns(false)
        isResponsePartiallyRejectedDueToStub.withArgs(RejectPartOfClaimOption.AMOUNT_TOO_HIGH).returns(true)

        const input = {
          howMuchIsPaid: {
            amount: 300,
            date: new LocalDate(20, 1, 12),
            text: 'I owe nothing'
          }
        }
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft().deserialize(input), claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('When will you pay?')
      })

      it('should be disabled in remaining cases', () => {
        isResponseFullyAdmittedStub.returns(false)
        isResponsePartiallyRejectedDueToStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('When will you pay?')
      })
    })
  })
})
