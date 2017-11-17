import { expect } from 'chai'

import * as sinon from 'sinon'

import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { ResponseDraft } from 'response/draft/responseDraft'
import { TaskList } from 'drafts/tasks/taskList'
import moment = require('moment')
import { RejectPartOfClaimOption } from 'response/form/models/rejectPartOfClaim'
import { LocalDate } from 'forms/models/localDate'

describe('TaskListBuilder', () => {
  let stub: sinon.SinonStub

  afterEach(() => {
    stub.restore()
  })

  describe('respond to claim section', () => {
    describe('Free mediation task', () => {
      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'requireMediation')
      })

      it('should be enabled when mediation is available', () => {
        stub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.contain('Free mediation')
      })

      it('should be disabled when mediation is not available', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Free mediation')
      })
    })

    describe('Is Response Partially Rejected Due To task', () => {
      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyRejectedDueTo')
      })

      it('should be enabled when claim is partially rejected due to amount being too high', () => {
        stub.withArgs(RejectPartOfClaimOption.AMOUNT_TOO_HIGH).returns(true)

        const input = {
          howMuchOwed: {
            amount: 200,
            text: 'I owe nothing'
          }
        }
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.contain('When will you pay?')
      })

      it('should be disabled in remaining cases', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('When will you pay?')
      })
    })

    describe('Is Response Partially Rejected Due To task', () => {
      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyRejectedDueTo')
      })

      it('should be enabled when claim is partially rejected due to amount being too high', () => {
        stub.withArgs(RejectPartOfClaimOption.AMOUNT_TOO_HIGH).returns(true)

        const input = {
          howMuchOwed: {
            amount: 200,
            text: 'I owe nothing'
          }
        }
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.contain('When will you pay?')
      })

      it('should be disabled in remaining cases', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('When will you pay?')
      })

      it('should be enabled in remaining cases', () => {
        stub.withArgs(RejectPartOfClaimOption.PAID_WHAT_BELIEVED_WAS_OWED).returns(true)

        const input = {
          howMuchIsPaid: {
            amount: 300,
            date : new LocalDate(20, 1, 12),
            text: 'I owe nothing'
          }
        }
        const responseDraft: ResponseDraft = new ResponseDraft().deserialize(input)
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.contain('How much have you paid the claimant?')
      })

      it('should be disabled when how much paid the claimant is not available', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), moment(), undefined)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('How much have you paid the claimant?')
      })
    })
  })
})
