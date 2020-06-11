"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon = require("sinon");
const taskListBuilder_1 = require("response/helpers/taskListBuilder");
const responseDraft_1 = require("response/draft/responseDraft");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const claim_1 = require("claims/models/claim");
const responseDraft_2 = require("test/data/draft/responseDraft");
const momentFactory_1 = require("shared/momentFactory");
const partyType_1 = require("common/partyType");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const responseType_1 = require("response/form/models/responseType");
const statementOfMeansTask_1 = require("response/tasks/statementOfMeansTask");
const partyDetails_1 = require("forms/models/partyDetails");
const response_1 = require("response/form/models/response");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const yesNoOption_1 = require("models/yesNoOption");
const howMuchDoYouOwe_1 = require("response/form/models/howMuchDoYouOwe");
const defendant_1 = require("drafts/models/defendant");
const statementOfMeans_1 = require("response/draft/statementOfMeans");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
const featureToggles_1 = require("utils/featureToggles");
const externalId = claimStoreServiceMock.sampleClaimObj.externalId;
const mediationTaskLabel = 'Free telephone mediation';
const directionsQuestionnaireTaskLabel = 'Your hearing requirements';
describe('Defendant response task list builder', () => {
    let claim;
    before(() => {
        claim = new claim_1.Claim().deserialize(claimStoreServiceMock.sampleClaimObj);
    });
    describe('"Consider other options" section', () => {
        describe('"Do you need more time to respond?" task', () => {
            const responseDraft = new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft);
            const taskListItemText = 'Decide if you need more time to respond';
            it('should be available when defendant tries to respond before due day', async () => {
                claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().add(1, 'days');
                const taskList = await taskListBuilder_1.TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, momentFactory_1.MomentFactory.currentDateTime());
                chai_1.expect(taskList.tasks.find(task => task.name === taskListItemText)).not.to.be.undefined;
            });
            it('should be available when defendant tries to respond on due day before 4 PM', async () => {
                claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                claim.responseDeadline = momentFactory_1.MomentFactory.currentDate();
                const now = momentFactory_1.MomentFactory.currentDateTime().hour(15);
                const taskList = await taskListBuilder_1.TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, now);
                chai_1.expect(taskList.tasks.find(task => task.name === taskListItemText)).not.to.be.undefined;
            });
            it('should not be available when defendant tries to respond on due day after 4 PM', async () => {
                claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                claim.responseDeadline = momentFactory_1.MomentFactory.currentDate();
                const now = momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').hour(17);
                const taskList = await taskListBuilder_1.TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, now);
                chai_1.expect(taskList.tasks.find(task => task.name === taskListItemText)).to.be.undefined;
            });
            it('should not be available when defendant tries to respond after due day', async () => {
                claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().subtract(14, 'days').toString());
                claim.responseDeadline = momentFactory_1.MomentFactory.currentDate().subtract(40, 'days');
                const taskList = await taskListBuilder_1.TaskListBuilder.buildBeforeYouStartSection(responseDraft, claim, momentFactory_1.MomentFactory.currentDateTime());
                chai_1.expect(taskList.tasks.find(task => task.name === taskListItemText)).to.be.undefined;
            });
        });
    });
    describe('"Respond to claim" section', () => {
        describe('"How much have you paid?" task', () => {
            let isResponseRejectedFullyBecausePaidWhatOwedStub;
            beforeEach(() => {
                isResponseRejectedFullyBecausePaidWhatOwedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed');
            });
            afterEach(() => {
                isResponseRejectedFullyBecausePaidWhatOwedStub.restore();
            });
            it('should be enabled when claim is fully rejected because already paid what is owed', () => {
                isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true);
                const draft = new responseDraft_1.ResponseDraft();
                draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID, new howMuchHaveYouPaid_1.HowMuchHaveYouPaid());
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Tell us how much you’ve paid');
            });
            it('should be disabled otherwise', () => {
                isResponseRejectedFullyBecausePaidWhatOwedStub.returns(false);
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(new responseDraft_1.ResponseDraft(), claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).not.to.contain('Tell us how much you’ve paid');
            });
        });
        describe('"Why do you disagree with the amount claimed?" task', () => {
            let isResponseRejectedFullyBecausePaidWhatOwedStub;
            beforeEach(() => {
                isResponseRejectedFullyBecausePaidWhatOwedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed');
                isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true);
            });
            afterEach(() => {
                isResponseRejectedFullyBecausePaidWhatOwedStub.restore();
            });
            it('should be enabled when claim is fully rejected because paid in full but less than claim amount', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID, new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(claim.totalAmountTillToday - 1));
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the amount claimed?');
            });
            it('should be disabled otherwise', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.rejectAllOfClaim = new rejectAllOfClaim_1.RejectAllOfClaim(rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID, new howMuchHaveYouPaid_1.HowMuchHaveYouPaid(claim.totalAmountTillToday + 1));
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).not.to.contain('Why do you disagree with the amount claimed?');
            });
        });
        describe('"Tell us why you disagree with the claim" task', () => {
            let stub;
            const responseDraft = new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft);
            beforeEach(() => {
                stub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute');
            });
            afterEach(() => {
                stub.restore();
            });
            it('should be enabled when response is rejected with dispute', () => {
                stub.returns(true);
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(responseDraft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Tell us why you disagree with the claim');
            });
            it('should be disabled when response is not rejected with dispute', () => {
                stub.returns(false);
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(responseDraft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.not.contain('Tell us why you disagree with the claim');
            });
        });
        describe('"Decide how you’ll pay" task', () => {
            let isResponseFullyAdmittedStub;
            let isResponseFullyAdmittedWithPayBySetDateStub;
            beforeEach(() => {
                isResponseFullyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmitted');
                isResponseFullyAdmittedWithPayBySetDateStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmittedWithPayBySetDate');
            });
            afterEach(() => {
                isResponseFullyAdmittedStub.restore();
                isResponseFullyAdmittedWithPayBySetDateStub.restore();
            });
            it('should be enabled when claim is fully admitted', () => {
                isResponseFullyAdmittedStub.returns(true);
                isResponseFullyAdmittedWithPayBySetDateStub.returns(false);
                const draft = new responseDraft_1.ResponseDraft();
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
                draft.defendantDetails.partyDetails.type = partyType_1.PartyType.INDIVIDUAL.value;
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Decide how you’ll pay');
            });
            it('should be disabled in remaining cases', () => {
                isResponseFullyAdmittedStub.returns(false);
                const draft = new responseDraft_1.ResponseDraft();
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).not.to.contain('Decide how you’ll pay');
            });
        });
        describe('"Your repayment plan" task', () => {
            let isResponseFullyAdmittedWithInstalmentsStub;
            let isResponseFullyAdmittedStub;
            beforeEach(() => {
                isResponseFullyAdmittedWithInstalmentsStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmittedWithInstalments');
                isResponseFullyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmitted');
            });
            afterEach(() => {
                isResponseFullyAdmittedWithInstalmentsStub.restore();
                isResponseFullyAdmittedStub.restore();
            });
            it('should be enabled when claim is fully admitted with payment option as instalments', () => {
                isResponseFullyAdmittedWithInstalmentsStub.returns(true);
                isResponseFullyAdmittedStub.returns(true);
                const draft = new responseDraft_1.ResponseDraft();
                draft.defendantDetails = new defendant_1.Defendant(new partyDetails_1.PartyDetails('John'));
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Your repayment plan');
            });
            it('should be disabled in remaining cases', () => {
                isResponseFullyAdmittedWithInstalmentsStub.returns(false);
                isResponseFullyAdmittedStub.returns(false);
                const draft = new responseDraft_1.ResponseDraft();
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).not.to.contain('Your repayment plan');
            });
        });
        describe('"Share your financial details" task', () => {
            let isResponseFullyAdmittedStub;
            let isResponseFullyAdmittedWithPayBySetDateStub;
            let isStatementOfMeansStub;
            beforeEach(() => {
                isResponseFullyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmitted');
                isResponseFullyAdmittedWithPayBySetDateStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmittedWithPayBySetDate');
                isStatementOfMeansStub = sinon.stub(statementOfMeansTask_1.StatementOfMeansTask, 'isCompleted');
            });
            afterEach(() => {
                isResponseFullyAdmittedStub.restore();
                isResponseFullyAdmittedWithPayBySetDateStub.restore();
                isStatementOfMeansStub.restore();
            });
            it('should be enabled when claim is fully admitted for an individual with payment option by set date', () => {
                isResponseFullyAdmittedStub.returns(true);
                isResponseFullyAdmittedWithPayBySetDateStub.returns(true);
                isStatementOfMeansStub.returns(true);
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
                draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
                draft.defendantDetails.partyDetails.type = partyType_1.PartyType.INDIVIDUAL.value;
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                draft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.BY_SET_DATE);
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Share your financial details');
            });
            it('should be enabled when claim is fully admitted for an organisation with payment option by set date', () => {
                isResponseFullyAdmittedStub.returns(true);
                isResponseFullyAdmittedWithPayBySetDateStub.returns(true);
                isStatementOfMeansStub.returns(true);
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.FULL_ADMISSION);
                draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
                draft.defendantDetails.partyDetails.type = partyType_1.PartyType.ORGANISATION.value;
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                draft.fullAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                draft.fullAdmission.paymentIntention.paymentOption = new paymentOption_1.PaymentOption(paymentOption_1.PaymentType.BY_SET_DATE);
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Share your financial details');
            });
            it('should be disabled in remaining cases', () => {
                isResponseFullyAdmittedStub.returns(false);
                isResponseFullyAdmittedWithPayBySetDateStub.returns(false);
                const draft = new responseDraft_1.ResponseDraft();
                draft.fullAdmission = new responseDraft_1.FullAdmission();
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).not.to.contain('Share your financial details');
            });
        });
        describe('"How much have you paid?" and "Why do you disagree with the claim amount?" task', () => {
            let isResponseFullyAdmittedStub;
            let isResponseFullyAdmittedWithPayBySetDateStub;
            let isResponsePartiallyAdmittedStub;
            beforeEach(() => {
                isResponseFullyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmitted');
                isResponseFullyAdmittedWithPayBySetDateStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmittedWithPayBySetDate');
                isResponsePartiallyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponsePartiallyAdmitted');
            });
            afterEach(() => {
                isResponseFullyAdmittedStub.restore();
                isResponseFullyAdmittedWithPayBySetDateStub.restore();
                isResponsePartiallyAdmittedStub.restore();
            });
            it('should be enabled when response is PART_ADMISSION and alreadyPaid is YES', () => {
                isResponseFullyAdmittedStub.returns(false);
                isResponseFullyAdmittedWithPayBySetDateStub.returns(false);
                isResponsePartiallyAdmittedStub.returns(true);
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                draft.partialAdmission = new responseDraft_1.PartialAdmission();
                draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
                draft.defendantDetails.partyDetails.type = partyType_1.PartyType.INDIVIDUAL.value;
                draft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid(yesNoOption_1.YesNoOption.YES);
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('How much have you paid?');
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the amount claimed?');
            });
            it('should be enabled when response is PART_ADMISSION and alreadyPaid is YES should clear payment ' +
                'intention and statement of means', () => {
                isResponseFullyAdmittedStub.returns(false);
                isResponseFullyAdmittedWithPayBySetDateStub.returns(false);
                isResponsePartiallyAdmittedStub.returns(true);
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                draft.partialAdmission = new responseDraft_1.PartialAdmission();
                draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
                draft.defendantDetails.partyDetails.type = partyType_1.PartyType.INDIVIDUAL.value;
                draft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid(yesNoOption_1.YesNoOption.YES);
                draft.partialAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                draft.statementOfMeans = new statementOfMeans_1.StatementOfMeans();
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('How much have you paid?');
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Why do you disagree with the amount claimed?');
                chai_1.expect(draft.partialAdmission.paymentIntention).to.be.undefined;
                chai_1.expect(draft.statementOfMeans).to.be.undefined;
            });
        });
        describe('"When will you pay the £xxx?" task', () => {
            let isResponsePartiallyAdmittedStub;
            beforeEach(() => {
                isResponsePartiallyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponsePartiallyAdmitted');
                isResponsePartiallyAdmittedStub.returns(true);
            });
            afterEach(() => {
                isResponsePartiallyAdmittedStub.restore();
            });
            it('should be enabled when response is PART_ADMISSION and alreadyPaid is "NO" and how much you admit populated', () => {
                const draft = new responseDraft_1.ResponseDraft();
                draft.response = new response_1.Response(responseType_1.ResponseType.PART_ADMISSION);
                draft.defendantDetails.partyDetails = new partyDetails_1.PartyDetails();
                draft.defendantDetails.partyDetails.type = partyType_1.PartyType.INDIVIDUAL.value;
                draft.partialAdmission = new responseDraft_1.PartialAdmission();
                draft.partialAdmission.alreadyPaid = new alreadyPaid_1.AlreadyPaid(yesNoOption_1.YesNoOption.NO);
                draft.partialAdmission.howMuchDoYouOwe = new howMuchDoYouOwe_1.HowMuchDoYouOwe(100, 200);
                draft.partialAdmission.paymentIntention = new paymentIntention_1.PaymentIntention();
                const taskList = taskListBuilder_1.TaskListBuilder.buildRespondToClaimSection(draft, claim);
                chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('When will you pay the £100?');
            });
        });
        describe('"Free telephone mediation" task', () => {
            let isResponseRejectedFullyWithDisputeStub;
            let isResponsePartiallyAdmitted;
            let isResponseRejectedFullyBecausePaidWhatOwed;
            beforeEach(() => {
                isResponseRejectedFullyWithDisputeStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute');
                isResponsePartiallyAdmitted = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponsePartiallyAdmitted');
                isResponseRejectedFullyBecausePaidWhatOwed = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed');
            });
            afterEach(() => {
                isResponseRejectedFullyWithDisputeStub.restore();
                isResponsePartiallyAdmitted.restore();
                isResponseRejectedFullyBecausePaidWhatOwed.restore();
            });
            context('should be enabled when', () => {
                it('response is rejected with dispute', () => {
                    isResponseRejectedFullyWithDisputeStub.returns(true);
                    isResponsePartiallyAdmitted.returns(false);
                    isResponseRejectedFullyBecausePaidWhatOwed.returns(false);
                    const taskList = taskListBuilder_1.TaskListBuilder.buildResolvingClaimSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
                it('response is rejected with already paid', () => {
                    isResponseRejectedFullyWithDisputeStub.returns(false);
                    isResponsePartiallyAdmitted.returns(false);
                    isResponseRejectedFullyBecausePaidWhatOwed.returns(true);
                    const taskList = taskListBuilder_1.TaskListBuilder.buildResolvingClaimSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted), claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
                it('response is partial admission and why do you disagree is completed', () => {
                    isResponseRejectedFullyWithDisputeStub.returns(false);
                    isResponsePartiallyAdmitted.returns(true);
                    isResponseRejectedFullyBecausePaidWhatOwed.returns(false);
                    const taskList = taskListBuilder_1.TaskListBuilder.buildResolvingClaimSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted), claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
            });
            context('should be disabled when', () => {
                it('response is not rejected with dispute', () => {
                    isResponseRejectedFullyWithDisputeStub.returns(false);
                    isResponsePartiallyAdmitted.returns(false);
                    isResponseRejectedFullyBecausePaidWhatOwed.returns(false);
                    const taskList = taskListBuilder_1.TaskListBuilder.buildResolvingClaimSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim);
                    chai_1.expect(taskList).to.be.undefined;
                });
            });
        });
    });
    describe('"Your hearing requirements"', () => {
        beforeEach(() => {
            claim.features = ['admissions', 'directionsQuestionnaire'];
        });
        describe('response is partial admission', () => {
            it('Give us details in case there is a hearing should appear in task list', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.name).to.contain(directionsQuestionnaireTaskLabel);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no hearing location selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no expert report selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: 'yes' }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no other witnesses selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    exportReport: { declared: false, rows: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no availability selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    exportReport: { declared: false, rows: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be enabled after choosing availability and next steps', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'no' } },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(true);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no permission for expert not selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    exportReport: { declared: false, rows: [] },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no expert evidence selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] },
                    permissionForExpert: { option: { option: 'yes' } }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no selection of why expert is needed', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    exportReport: { declared: false, rows: [] },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] },
                    permissionForExpert: { option: { option: 'yes' } },
                    expertEvidence: { expertEvidence: { option: 'yes' }, whatToExamine: 'evidence' }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
        });
        describe('response is full defence', () => {
            it('Give us details in case there is a hearing should appear in task list', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.name).to.contain(directionsQuestionnaireTaskLabel);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no hearing location selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no expert report selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: 'yes' }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no other witnesses selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    exportReport: { declared: false, rows: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no availability selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    exportReport: { declared: false, rows: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be enabled after choosing availability and next steps', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'no' } },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(true);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no permission for expert not selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    exportReport: { declared: false, rows: [] },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no expert evidence selected', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] },
                    permissionForExpert: { option: { option: 'yes' } }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
            it('Give us details in case there is a hearing should be disabled when there is no selection of why expert is needed', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.defenceWithDisputeDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft().deserialize({
                    externalId: claim.externalId,
                    selfWitness: { option: { option: 'no' } },
                    hearingLocation: 'central london',
                    expertRequired: { option: { option: 'yes' } },
                    exportReport: { declared: false, rows: [] },
                    otherWitnesses: { otherWitnesses: { option: 'yes' }, howMany: 1 },
                    availability: { hasUnavailableDates: false, unavailableDates: [] },
                    permissionForExpert: { option: { option: 'yes' } },
                    expertEvidence: { expertEvidence: { option: 'yes' }, whatToExamine: 'evidence' }
                }));
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    chai_1.expect(taskList.tasks[0].completed).equal(false);
                }
            });
        });
        it('response is full admit', () => {
            const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(new responseDraft_1.ResponseDraft().deserialize(responseDraft_2.fullAdmissionWithImmediatePaymentDraft), claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
            chai_1.expect(taskList).to.be.undefined;
        });
    });
    describe('"Check and submit your response" task', () => {
        let isResponsePopulatedStub;
        let isResponseRejectedFullyWithDisputePaidStub;
        let isResponseRejectedFullyBecausePaidWhatOwedStub;
        let isResponseFullyAdmittedStub;
        let isResponsePartiallyAdmittedStub;
        beforeEach(() => {
            isResponsePopulatedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponsePopulated');
            isResponsePartiallyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponsePartiallyAdmitted');
            isResponseRejectedFullyWithDisputePaidStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute');
            isResponseRejectedFullyBecausePaidWhatOwedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyBecausePaidWhatOwed');
            isResponseFullyAdmittedStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseFullyAdmitted');
        });
        afterEach(() => {
            isResponsePopulatedStub.restore();
            isResponseRejectedFullyWithDisputePaidStub.restore();
            isResponseRejectedFullyBecausePaidWhatOwedStub.restore();
            isResponseFullyAdmittedStub.restore();
            isResponsePartiallyAdmittedStub.restore();
        });
        it('should be enabled when claim is fully rejected with dispute', () => {
            isResponseRejectedFullyWithDisputePaidStub.returns(true);
            isResponseRejectedFullyBecausePaidWhatOwedStub.returns(false);
            const taskList = taskListBuilder_1.TaskListBuilder.buildSubmitSection(claim, new responseDraft_1.ResponseDraft(), externalId);
            chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response');
        });
        it('should be enabled when claim is fully rejected due to claimed amount being paid', () => {
            isResponseRejectedFullyWithDisputePaidStub.returns(false);
            isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true);
            isResponsePartiallyAdmittedStub.returns(false);
            const taskList = taskListBuilder_1.TaskListBuilder.buildSubmitSection(claim, new responseDraft_1.ResponseDraft(), externalId);
            chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response');
        });
        it('should be enabled when claim is fully admitted', () => {
            isResponseFullyAdmittedStub.returns(true);
            isResponsePartiallyAdmittedStub.returns(false);
            const taskList = taskListBuilder_1.TaskListBuilder.buildSubmitSection(claim, new responseDraft_1.ResponseDraft(), externalId);
            chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response');
        });
        it('should be enabled when claim is fully rejected because paid in full gte claim amount', () => {
            isResponseRejectedFullyBecausePaidWhatOwedStub.returns(true);
            const taskList = taskListBuilder_1.TaskListBuilder.buildSubmitSection(claim, new responseDraft_1.ResponseDraft(), externalId);
            chai_1.expect(taskList.tasks.map(task => task.name)).to.contain('Check and submit your response');
        });
        it('should be disabled in remaining cases', () => {
            isResponsePopulatedStub.returns(true);
            isResponseRejectedFullyWithDisputePaidStub.returns(false);
            isResponseRejectedFullyBecausePaidWhatOwedStub.returns(false);
            isResponseFullyAdmittedStub.returns(false);
            isResponsePartiallyAdmittedStub.returns(false);
            const taskList = taskListBuilder_1.TaskListBuilder.buildSubmitSection(claim, new responseDraft_1.ResponseDraft(), externalId);
            chai_1.expect(taskList).to.be.undefined;
        });
    });
    describe('buildRemainingTasks', () => {
        let isResponseRejectedFullyWithDisputeStub;
        beforeEach(() => {
            isResponseRejectedFullyWithDisputeStub = sinon.stub(responseDraft_1.ResponseDraft.prototype, 'isResponseRejectedFullyWithDispute');
        });
        afterEach(() => {
            isResponseRejectedFullyWithDisputeStub.restore();
        });
        it('Should return "Free telephone mediation" when not completed for fully reject', async () => {
            claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
            isResponseRejectedFullyWithDisputeStub.returns(true);
            const tasks = await taskListBuilder_1.TaskListBuilder.buildRemainingTasks(new responseDraft_1.ResponseDraft(), claim, new mediationDraft_1.MediationDraft(), new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
            chai_1.expect(tasks.map(task => task.name)).to.contain(mediationTaskLabel);
        });
        it('Should not return "Free telephone mediation" when not fully reject', async () => {
            claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
            isResponseRejectedFullyWithDisputeStub.returns(false);
            const tasks = await taskListBuilder_1.TaskListBuilder.buildRemainingTasks(new responseDraft_1.ResponseDraft(), claim, new mediationDraft_1.MediationDraft(), new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
            chai_1.expect(tasks.map(task => task.name)).not.to.contain(mediationTaskLabel);
        });
    });
});
