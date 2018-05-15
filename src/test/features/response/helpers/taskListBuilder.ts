import { expect } from 'chai'

import * as sinon from 'sinon'

import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { ResponseDraft } from 'response/draft/responseDraft'
import { TaskList } from 'drafts/tasks/taskList'
import { LocalDate } from 'forms/models/localDate'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Claim } from 'claims/models/claim'

describe('Defendant response task list builder', () => {
  let claim: Claim

  before(() => {
    claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimObj)
  })

  describe('"Respond to claim" section', () => {
    describe('"Why do you disagree with the claim?" task', () => {
      let stub: sinon.SinonStub

      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
      })

      afterEach(() => {
        stub.restore()
      })

      it('should be enabled when response is rejected with dispute', () => {
        stub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the claim?')
      })

      it('should be disabled when response is not rejected with dispute', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Why do you disagree with the claim?')
      })
    })

    describe('"Free mediation" task', () => {
      let stub: sinon.SinonStub

      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
      })

      afterEach(() => {
        stub.restore()
      })

      it('should be enabled when response is rejected with dispute', () => {
        stub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Free mediation')
      })

      it('should be disabled when response is not rejected with dispute', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Free mediation')
      })
    })

    describe('"When did you pay" task', () => {
      let isResponseRejectedFullyWithAmountClaimedPaidStub: sinon.SinonStub

      beforeEach(() => {
        isResponseRejectedFullyWithAmountClaimedPaidStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithAmountClaimedPaid')
      })

      afterEach(() => {
        isResponseRejectedFullyWithAmountClaimedPaidStub.restore()
      })

      it('should be enabled when claim is fully rejected due to amount being paid and claimed', () => {
        isResponseRejectedFullyWithAmountClaimedPaidStub.returns(true)

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
        isResponseRejectedFullyWithAmountClaimedPaidStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('When did you pay?')
      })
    })

    describe('"Check and submit your response" task', () => {
      let isResponsePopulatedStub: sinon.SinonStub
      let isResponseRejectedFullyWithDisputePaidStub: sinon.SinonStub
      let isResponseRejectedFullyWithAmountClaimedPaidStub: sinon.SinonStub

      beforeEach(() => {
        isResponsePopulatedStub = sinon.stub(ResponseDraft.prototype, 'isResponsePopulated')
        isResponseRejectedFullyWithDisputePaidStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
        isResponseRejectedFullyWithAmountClaimedPaidStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithAmountClaimedPaid')
      })

      afterEach(() => {
        isResponsePopulatedStub.restore()
        isResponseRejectedFullyWithDisputePaidStub.restore()
        isResponseRejectedFullyWithAmountClaimedPaidStub.restore()
      })

      it('should be enabled when claim is fully rejected with dispute', () => {
        isResponseRejectedFullyWithDisputePaidStub.returns(true)
        isResponseRejectedFullyWithAmountClaimedPaidStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildSubmitSection(new ResponseDraft(), claimStoreServiceMock.sampleClaimObj.externalId)
        expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')
      })

      it('should be enabled when claim is fully rejected due to claimed amount being paid', () => {
        isResponseRejectedFullyWithDisputePaidStub.returns(false)
        isResponseRejectedFullyWithAmountClaimedPaidStub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildSubmitSection(new ResponseDraft(), claimStoreServiceMock.sampleClaimObj.externalId)
        expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')
      })

      it('should be disabled in remaining cases', () => {
        isResponsePopulatedStub.returns(true)
        isResponseRejectedFullyWithDisputePaidStub.returns(false)
        isResponseRejectedFullyWithAmountClaimedPaidStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildSubmitSection(new ResponseDraft(), claimStoreServiceMock.sampleClaimObj.externalId)
        expect(taskList).to.be.equal(undefined)
      })
    })
  })
})
