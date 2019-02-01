/* tslint:disable:no-unused-expression */

import { expect } from 'chai'

import * as sinon from 'sinon'
import * as moment from 'moment'

import { TaskListBuilder } from 'response/helpers/taskListBuilder'
import { FullAdmission, PartialAdmission, ResponseDraft } from 'response/draft/responseDraft'
import { TaskList } from 'drafts/tasks/taskList'
import * as claimStoreServiceMock from 'test/http-mocks/claim-store'
import { Claim } from 'claims/models/claim'
import {
  defenceWithDisputeDraft,
  partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted
} from 'test/data/draft/responseDraft'
import { MomentFactory } from 'shared/momentFactory'
import { PartyType } from 'common/partyType'
import { PaymentOption, PaymentType } from 'shared/components/payment-intention/model/paymentOption'
import { ResponseType } from 'response/form/models/responseType'
import { StatementOfMeansTask } from 'response/tasks/statementOfMeansTask'
import { PartyDetails } from 'forms/models/partyDetails'
import { Response } from 'response/form/models/response'
import { AlreadyPaid } from 'response/form/models/alreadyPaid'
import { YesNoOption } from 'models/yesNoOption'
import { HowMuchDoYouOwe } from 'response/form/models/howMuchDoYouOwe'
import { Defendant } from 'drafts/models/defendant'
import { StatementOfMeans } from 'response/draft/statementOfMeans'
import { RejectAllOfClaim, RejectAllOfClaimOption } from 'response/form/models/rejectAllOfClaim'
import { HowMuchHaveYouPaid } from 'response/form/models/howMuchHaveYouPaid'
import { PaymentIntention } from 'shared/components/payment-intention/model/paymentIntention'
import { TaskListItem } from 'drafts/tasks/taskListItem'

const externalId: string = claimStoreServiceMock.sampleClaimObj.externalId
const features: string[] = ['admissions']
describe('Defendant response task list builder', () => {
  let claim: Claim

  before(() => {
    claim = new Claim().deserialize(claimStoreServiceMock.sampleClaimObj)
  })

  describe('"Before you start" section', () => {
    describe('"Do you need more time to respond?" task', () => {
      const responseDraft: ResponseDraft = new ResponseDraft().deserialize(defenceWithDisputeDraft)
      const taskListItemText: string = 'Decide if you need more time to respond'

      it('should be available when defendant tries to respond before due day', () => {
        claim.responseDeadline = MomentFactory.currentDate().add(1, 'days')
        const taskList: TaskList = TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, MomentFactory.currentDateTime())
        expect(taskList.tasks.find(task => task.name === taskListItemText)).not.to.be.undefined
      })

      it('should be available when defendant tries to respond on due day before 4 PM', () => {
        claim.responseDeadline = MomentFactory.currentDate()
        const now: moment.Moment = MomentFactory.currentDateTime().hour(15)
        const taskList: TaskList = TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, now)
        expect(taskList.tasks.find(task => task.name === taskListItemText)).not.to.be.undefined
      })

      it('should not be available when defendant tries to respond on due day after 4 PM', () => {
        claim.responseDeadline = MomentFactory.currentDate()
        const now: moment.Moment = MomentFactory.currentDateTime().hour(17)
        const taskList: TaskList = TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, now)
        expect(taskList.tasks.find(task => task.name === taskListItemText)).to.be.undefined
      })

      it('should not be available when defendant tries to respond after due day', () => {
        claim.responseDeadline = MomentFactory.currentDate().subtract(1, 'days')
        const taskList: TaskList = TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, MomentFactory.currentDateTime())
        expect(taskList.tasks.find(task => task.name === taskListItemText)).to.be.undefined
      })
    })
  })

  describe('"Respond to claim" section', () => {
    describe('"How much have you paid?" task', () => {
      let isResponseRejectedFullyBecausePaidWhatOwedStub: sinon.SinonStub

      beforeEach(() => {
        isResponseRejectedFullyBecausePaidWhatOwedStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed')
      })

      afterEach(() => {
        isResponseRejectedFullyBecausePaidWhatOwedStub.restore()
      })

      it('should be enabled when claim is fully rejected because already paid what is owed', () => {
        isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true)
        const draft = new ResponseDraft()
        draft.rejectAllOfClaim = new RejectAllOfClaim(RejectAllOfClaimOption.ALREADY_PAID, new HowMuchHaveYouPaid())

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Tell us how much you’ve paid')
      })

      it('should be disabled otherwise', () => {
        isResponseRejectedFullyBecausePaidWhatOwedStub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(new ResponseDraft(), claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Tell us how much you’ve paid')
      })
    })

    describe('"Why do you disagree with the amount claimed?" task', () => {
      let isResponseRejectedFullyBecausePaidWhatOwedStub: sinon.SinonStub

      beforeEach(() => {
        isResponseRejectedFullyBecausePaidWhatOwedStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed')
        isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true)
      })

      afterEach(() => {
        isResponseRejectedFullyBecausePaidWhatOwedStub.restore()
      })

      it('should be enabled when claim is fully rejected because paid in full but less than claim amount', () => {
        const draft = new ResponseDraft()
        draft.rejectAllOfClaim = new RejectAllOfClaim(
          RejectAllOfClaimOption.ALREADY_PAID,
          new HowMuchHaveYouPaid(claim.totalAmountTillToday - 1)
        )

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the amount claimed?')
      })

      it('should be disabled otherwise', () => {
        const draft = new ResponseDraft()
        draft.rejectAllOfClaim = new RejectAllOfClaim(
          RejectAllOfClaimOption.ALREADY_PAID,
          new HowMuchHaveYouPaid(claim.totalAmountTillToday + 1)
        )
        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Why do you disagree with the amount claimed?')
      })
    })

    describe('"Why do you disagree with the claim?" task', () => {
      let stub: sinon.SinonStub
      const responseDraft: ResponseDraft = new ResponseDraft().deserialize(defenceWithDisputeDraft)

      beforeEach(() => {
        stub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
      })

      afterEach(() => {
        stub.restore()
      })

      it('should be enabled when response is rejected with dispute', () => {
        stub.returns(true)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the claim?')
      })

      it('should be disabled when response is not rejected with dispute', () => {
        stub.returns(false)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(responseDraft, claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Why do you disagree with the claim?')
      })
    })

    describe('"Decide how you’ll pay" task', () => {
      let isResponseFullyAdmittedStub: sinon.SinonStub
      let isResponseFullyAdmittedWithPayBySetDateStub: sinon.SinonStub

      beforeEach(() => {
        isResponseFullyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmitted')
        isResponseFullyAdmittedWithPayBySetDateStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmittedWithPayBySetDate')
      })

      afterEach(() => {
        isResponseFullyAdmittedStub.restore()
        isResponseFullyAdmittedWithPayBySetDateStub.restore()
      })

      it('should be enabled when claim is fully admitted', () => {
        isResponseFullyAdmittedStub.returns(true)
        isResponseFullyAdmittedWithPayBySetDateStub.returns(false)
        const draft = new ResponseDraft()
        draft.fullAdmission = new FullAdmission()
        draft.fullAdmission.paymentIntention = new PaymentIntention()
        draft.defendantDetails.partyDetails = new PartyDetails()
        draft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Decide how you’ll pay')
      })

      it('should be disabled in remaining cases', () => {
        isResponseFullyAdmittedStub.returns(false)

        const draft = new ResponseDraft()
        draft.fullAdmission = new FullAdmission()

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Decide how you’ll pay')
      })
    })

    describe('"Your repayment plan" task', () => {
      let isResponseFullyAdmittedWithInstalmentsStub: sinon.SinonStub
      let isResponseFullyAdmittedStub: sinon.SinonStub

      beforeEach(() => {
        isResponseFullyAdmittedWithInstalmentsStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmittedWithInstalments')
        isResponseFullyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmitted')
      })

      afterEach(() => {
        isResponseFullyAdmittedWithInstalmentsStub.restore()
        isResponseFullyAdmittedStub.restore()
      })

      it('should be enabled when claim is fully admitted with payment option as instalments', () => {
        isResponseFullyAdmittedWithInstalmentsStub.returns(true)
        isResponseFullyAdmittedStub.returns(true)

        const draft = new ResponseDraft()
        draft.defendantDetails = new Defendant(new PartyDetails('John'))
        draft.fullAdmission = new FullAdmission()
        draft.fullAdmission.paymentIntention = new PaymentIntention()

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Your repayment plan')
      })

      it('should be disabled in remaining cases', () => {
        isResponseFullyAdmittedWithInstalmentsStub.returns(false)
        isResponseFullyAdmittedStub.returns(false)

        const draft = new ResponseDraft()
        draft.fullAdmission = new FullAdmission()

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Your repayment plan')
      })
    })

    describe('"Share your financial details" task', () => {
      let isResponseFullyAdmittedStub: sinon.SinonStub
      let isResponseFullyAdmittedWithPayBySetDateStub: sinon.SinonStub
      let isStatementOfMeansStub: sinon.SinonStub

      beforeEach(() => {
        isResponseFullyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmitted')
        isResponseFullyAdmittedWithPayBySetDateStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmittedWithPayBySetDate')
        isStatementOfMeansStub = sinon.stub(StatementOfMeansTask, 'isCompleted')
      })

      afterEach(() => {
        isResponseFullyAdmittedStub.restore()
        isResponseFullyAdmittedWithPayBySetDateStub.restore()
        isStatementOfMeansStub.restore()
      })

      it('should be enabled when claim is fully admitted for an individual with payment option by set date', () => {
        isResponseFullyAdmittedStub.returns(true)
        isResponseFullyAdmittedWithPayBySetDateStub.returns(true)
        isStatementOfMeansStub.returns(true)

        const draft = new ResponseDraft()
        draft.response = new Response(ResponseType.FULL_ADMISSION)
        draft.defendantDetails.partyDetails = new PartyDetails()
        draft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value
        draft.fullAdmission = new FullAdmission()
        draft.fullAdmission.paymentIntention = new PaymentIntention()
        draft.fullAdmission.paymentIntention.paymentOption = new PaymentOption(PaymentType.BY_SET_DATE)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Share your financial details')
      })

      it('should be enabled when claim is fully admitted for an organisation with payment option by set date', () => {
        isResponseFullyAdmittedStub.returns(true)
        isResponseFullyAdmittedWithPayBySetDateStub.returns(true)
        isStatementOfMeansStub.returns(true)

        const draft = new ResponseDraft()
        draft.response = new Response(ResponseType.FULL_ADMISSION)
        draft.defendantDetails.partyDetails = new PartyDetails()
        draft.defendantDetails.partyDetails.type = PartyType.ORGANISATION.value
        draft.fullAdmission = new FullAdmission()
        draft.fullAdmission.paymentIntention = new PaymentIntention()
        draft.fullAdmission.paymentIntention.paymentOption = new PaymentOption(PaymentType.BY_SET_DATE)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('Share your financial details')
      })

      it('should be disabled in remaining cases', () => {
        isResponseFullyAdmittedStub.returns(false)
        isResponseFullyAdmittedWithPayBySetDateStub.returns(false)

        const draft = new ResponseDraft()
        draft.fullAdmission = new FullAdmission()

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.not.contain('Share your financial details')
      })
    })

    describe('"How much have you paid?" and "Why do you disagree with the claim amount?" task', () => {
      let isResponseFullyAdmittedStub: sinon.SinonStub
      let isResponseFullyAdmittedWithPayBySetDateStub: sinon.SinonStub
      let isResponsePartiallyAdmittedStub: sinon.SinonStub

      beforeEach(() => {
        isResponseFullyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmitted')
        isResponseFullyAdmittedWithPayBySetDateStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmittedWithPayBySetDate')
        isResponsePartiallyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyAdmitted')
      })

      afterEach(() => {
        isResponseFullyAdmittedStub.restore()
        isResponseFullyAdmittedWithPayBySetDateStub.restore()
        isResponsePartiallyAdmittedStub.restore()
      })

      it('should be enabled when response is PART_ADMISSION and alreadyPaid is YES', () => {
        isResponseFullyAdmittedStub.returns(false)
        isResponseFullyAdmittedWithPayBySetDateStub.returns(false)
        isResponsePartiallyAdmittedStub.returns(true)

        const draft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.partialAdmission = new PartialAdmission()
        draft.defendantDetails.partyDetails = new PartyDetails()
        draft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value
        draft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.YES)

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('How much have you paid?')
        expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the amount claimed?')
      })

      it('should be enabled when response is PART_ADMISSION and alreadyPaid is YES should clear payment ' +
        'intention and statement of means', () => {
        isResponseFullyAdmittedStub.returns(false)
        isResponseFullyAdmittedWithPayBySetDateStub.returns(false)
        isResponsePartiallyAdmittedStub.returns(true)

        const draft = new ResponseDraft()
        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.partialAdmission = new PartialAdmission()
        draft.defendantDetails.partyDetails = new PartyDetails()
        draft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value
        draft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.YES)
        draft.partialAdmission.paymentIntention = new PaymentIntention()
        draft.statementOfMeans = new StatementOfMeans()

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('How much have you paid?')
        expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the amount claimed?')
        expect(draft.partialAdmission.paymentIntention).eq(undefined)
        expect(draft.statementOfMeans).eq(undefined)
      })

    })

    describe('"When will you pay the £xxx?" task', () => {
      let isResponsePartiallyAdmittedStub: sinon.SinonStub

      beforeEach(() => {
        isResponsePartiallyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyAdmitted')
        isResponsePartiallyAdmittedStub.returns(true)
      })

      afterEach(() => {
        isResponsePartiallyAdmittedStub.restore()
      })

      it('should be enabled when response is PART_ADMISSION and alreadyPaid is "NO" and how much you admit populated', () => {
        const draft = new ResponseDraft()

        draft.response = new Response(ResponseType.PART_ADMISSION)
        draft.defendantDetails.partyDetails = new PartyDetails()
        draft.defendantDetails.partyDetails.type = PartyType.INDIVIDUAL.value
        draft.partialAdmission = new PartialAdmission()
        draft.partialAdmission.alreadyPaid = new AlreadyPaid(YesNoOption.NO)
        draft.partialAdmission.howMuchDoYouOwe = new HowMuchDoYouOwe(100, 200)
        draft.partialAdmission.paymentIntention = new PaymentIntention()

        const taskList: TaskList = TaskListBuilder.buildRespondToClaimSection(draft, claim)
        expect(taskList.tasks.map(task => task.name)).to.contain('When will you pay the £100?')
      })
    })

    describe('"Consider free mediation" task', () => {
      let isResponseRejectedFullyWithDisputeStub: sinon.SinonStub
      let isResponsePartiallyAdmitted: sinon.SinonStub

      beforeEach(() => {
        isResponseRejectedFullyWithDisputeStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
        isResponsePartiallyAdmitted = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyAdmitted')
      })

      afterEach(() => {
        isResponseRejectedFullyWithDisputeStub.restore()
        isResponsePartiallyAdmitted.restore()
      })

      context('should be enabled when', () => {

        it('response is rejected with dispute', () => {
          isResponseRejectedFullyWithDisputeStub.returns(true)
          isResponsePartiallyAdmitted.returns(false)

          const taskList: TaskList = TaskListBuilder.buildResolvingClaimSection(
            new ResponseDraft().deserialize(defenceWithDisputeDraft), claim
          )

          expect(taskList.tasks.map(task => task.name)).to.contain('Consider free mediation')
        })

        it('response is partial admission and why do you disagree is completed', () => {
          isResponseRejectedFullyWithDisputeStub.returns(false)
          isResponsePartiallyAdmitted.returns(true)

          const taskList: TaskList = TaskListBuilder.buildResolvingClaimSection(
            new ResponseDraft().deserialize(partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted), claim
          )

          expect(taskList.tasks.map(task => task.name)).to.contain('Consider free mediation')
        })
      })

      context('should be disabled when', () => {

        it('response is not rejected with dispute', () => {
          isResponseRejectedFullyWithDisputeStub.returns(false)
          isResponsePartiallyAdmitted.returns(false)

          const taskList: TaskList = TaskListBuilder.buildResolvingClaimSection(
            new ResponseDraft().deserialize(defenceWithDisputeDraft), claim
          )

          expect(taskList).to.be.eq(undefined)
        })
      })
    })
  })

  describe('"Check and submit your response" task', () => {
    let isResponsePopulatedStub: sinon.SinonStub
    let isResponseRejectedFullyWithDisputePaidStub: sinon.SinonStub
    let isResponseRejectedFullyBecausePaidWhatOwedStub: sinon.SinonStub
    let isResponseFullyAdmittedStub: sinon.SinonStub
    let isResponsePartiallyAdmittedStub: sinon.SinonStub

    beforeEach(() => {
      isResponsePopulatedStub = sinon.stub(ResponseDraft.prototype, 'isResponsePopulated')
      isResponsePartiallyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponsePartiallyAdmitted')
      isResponseRejectedFullyWithDisputePaidStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
      isResponseRejectedFullyBecausePaidWhatOwedStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed')
      isResponseFullyAdmittedStub = sinon.stub(ResponseDraft.prototype, 'isResponseFullyAdmitted')
    })

    afterEach(() => {
      isResponsePopulatedStub.restore()
      isResponseRejectedFullyWithDisputePaidStub.restore()
      isResponseRejectedFullyBecausePaidWhatOwedStub.restore()
      isResponseFullyAdmittedStub.restore()
      isResponsePartiallyAdmittedStub.restore()
    })

    it('should be enabled when claim is fully rejected with dispute', () => {
      isResponseRejectedFullyWithDisputePaidStub.returns(true)
      isResponseRejectedFullyBecausePaidWhatOwedStub.returns(false)

      const taskList: TaskList = TaskListBuilder.buildSubmitSection(claim, new ResponseDraft(), externalId, features)
      expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')
    })

    it('should be enabled when claim is fully rejected due to claimed amount being paid', () => {
      isResponseRejectedFullyWithDisputePaidStub.returns(false)
      isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true)
      isResponsePartiallyAdmittedStub.returns(false)

      const taskList: TaskList = TaskListBuilder.buildSubmitSection(claim, new ResponseDraft(), externalId, features)
      expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')
    })

    it('should be enabled when claim is fully admitted', () => {
      isResponseFullyAdmittedStub.returns(true)
      isResponsePartiallyAdmittedStub.returns(false)

      const taskList: TaskList = TaskListBuilder.buildSubmitSection(claim, new ResponseDraft(), externalId, features)
      expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')
    })

    it('should be enabled when claim is fully rejected because paid in full gte claim amount', () => {
      isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true)

      const taskList: TaskList = TaskListBuilder.buildSubmitSection(claim, new ResponseDraft(), externalId, features)
      expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response')

    })

    it('should be disabled in remaining cases', () => {
      isResponsePopulatedStub.returns(true)
      isResponseRejectedFullyWithDisputePaidStub.returns(false)
      isResponseRejectedFullyBecausePaidWhatOwedStub.returns(false)
      isResponseFullyAdmittedStub.returns(false)
      isResponsePartiallyAdmittedStub.returns(false)

      const taskList: TaskList = TaskListBuilder.buildSubmitSection(claim, new ResponseDraft(), externalId, features)
      expect(taskList).to.be.equal(undefined)
    })
  })

  describe('buildRemainingTasks', () => {
    let isResponseRejectedFullyWithDisputeStub: sinon.SinonStub

    beforeEach(() => {
      isResponseRejectedFullyWithDisputeStub = sinon.stub(ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute')
    })

    afterEach(() => {
      isResponseRejectedFullyWithDisputeStub.restore()
    })

    it('Should return "Consider free mediation" when not completed for fully reject', () => {
      isResponseRejectedFullyWithDisputeStub.returns(true)

      const tasks: TaskListItem[] = TaskListBuilder.buildRemainingTasks(new ResponseDraft(), claim)
      expect(tasks.map(task => task.name)).to.contain('Consider free mediation')
    })

    it('Should not return "Consider free mediation" when not fully reject', () => {
      isResponseRejectedFullyWithDisputeStub.returns(false)

      const tasks: TaskListItem[] = TaskListBuilder.buildRemainingTasks(new ResponseDraft(), claim)
      expect(tasks.map(task => task.name)).to.not.contain('Consider free mediation')
    })
  })

})
