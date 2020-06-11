"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const taskListBuilder_1 = require("claimant-response/helpers/taskListBuilder");
const draftClaimantResponse_1 = require("claimant-response/draft/draftClaimantResponse");
const mediationDraft_1 = require("mediation/draft/mediationDraft");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claim_1 = require("claims/models/claim");
const yesNoOption_1 = require("claims/models/response/core/yesNoOption");
const featureToggles_1 = require("utils/featureToggles");
const responseData_1 = require("test/data/entity/responseData");
const numberFormatter_1 = require("utils/numberFormatter");
const directionsQuestionnaireDraft_1 = require("directions-questionnaire/draft/directionsQuestionnaireDraft");
describe('Claimant response task list builder', () => {
    let claim;
    let draft;
    const mediationTaskLabel = 'Free telephone mediation';
    beforeEach(() => {
        claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj));
        draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize({});
    });
    describe('"How they responded section" section', () => {
        describe('"View the defendant’s response" task', () => {
            it('should be available when claimant tries to respond', () => {
                const taskList = taskListBuilder_1.TaskListBuilder.buildDefendantResponseSection(draft, claim);
                chai_1.expect(taskList.tasks.find(task => task.name === 'View the defendant’s response')).not.to.be.undefined;
            });
        });
    });
    describe('"Choose what to do next" section', () => {
        describe('States paid task', () => {
            describe('"Accept or reject their response" task', () => {
                it('should be available when full defence response with already paid', () => {
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.defenceWithAmountClaimedAlreadyPaidData }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).not.to.be.undefined;
                });
            });
            describe('Have you been paid amount', () => {
                it('should be available for part admission of less than total claim amount', () => {
                    const amount = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1;
                    const claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: amount }) }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === `Have you been paid the ${numberFormatter_1.NumberFormatter.formatMoney(amount)}?`))
                        .to.not.be.undefined;
                });
            });
            describe('Settle the claim for amount task', () => {
                it('should be available for part admission of less than total claim where payment has been made', () => {
                    const amount = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1;
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: amount }) }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), { partPaymentReceived: { received: { option: yesNoOption_1.YesNoOption.YES } } }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === `Settle the claim for ${numberFormatter_1.NumberFormatter.formatMoney(amount)}?`)).to.not.be.undefined;
                });
            });
            describe('Have you been paid the full amount task', () => {
                it('should be available for part admission when payment is equal to total claim', () => {
                    const amount = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue;
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: amount }) }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === `Have you been paid the full ${numberFormatter_1.NumberFormatter.formatMoney(amount)}?`)).to.not.be.undefined;
                });
            });
            describe('Free mediation task', () => {
                it('Should be available when part payment has been stated as not paid', () => {
                    const amount = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1;
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: amount, freeMediation: 'yes' }) }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), { partPaymentReceived: { received: { option: yesNoOption_1.YesNoOption.NO } } }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
                it('Should be available when settle the claim has been rejected', () => {
                    const amount = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue - 1;
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: amount, freeMediation: 'yes' }) }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), { partPaymentReceived: { received: { option: yesNoOption_1.YesNoOption.YES } }, accepted: { accepted: { option: yesNoOption_1.YesNoOption.NO } } }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
                it('Should be available when "Have you been paid the full amount" is rejected', () => {
                    const amount = claimStoreServiceMock.sampleClaimObj.totalAmountTillDateOfIssue;
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: Object.assign(Object.assign({}, responseData_1.partialAdmissionAlreadyPaidData), { amount: amount, freeMediation: 'yes' }) }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), { accepted: { accepted: { option: yesNoOption_1.YesNoOption.NO } } }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildStatesPaidHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
            });
        });
        describe('"Accept or reject their response" task', () => {
            it('should be available when full defence response and no free mediation', () => {
                claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleDefendantResponseObj));
                claim.response.freeMediation = yesNoOption_1.YesNoOption.NO;
                const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).to.be.undefined;
            });
            it('should be available when full defence response and yes free mediation', () => {
                claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), claimStoreServiceMock.sampleDefendantResponseObj));
                claim.response.freeMediation = yesNoOption_1.YesNoOption.YES;
                const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their response')).to.be.undefined;
            });
        });
        describe('"Accept or reject the (amount)" task', () => {
            it('should be available when response type is part admission', () => {
                claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), {
                    response: responseData_1.partialAdmissionWithPaymentBySetDateData
                }));
                const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject the £3,000')).not.to.be.undefined;
            });
            it('should not be available when response type is part admission already paid', () => {
                claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), {
                    response: responseData_1.partialAdmissionAlreadyPaidData
                }));
                const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                chai_1.expect(taskList.tasks.find(task => task.name.startsWith('Accept or reject the £'))).to.be.undefined;
            });
        });
        describe('"Accept or reject their repayment plan" task', () => {
            describe('when response type is part admission', () => {
                it('should be available when payment will be made by set date and amount is accepted by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'yes'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined;
                });
                it('should be available when payment will be made by instalments and amount is accepted by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentByInstalmentsData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'yes'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined;
                });
                it('should not be available when payment amount is not accepted by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined;
                });
                it('should not be available when payment will be made immediately', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithImmediatePaymentData() }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: undefined
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined;
                });
                it('should not be available when payment was already made', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionAlreadyPaidData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: undefined
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined;
                });
            });
            describe('when response type is full admission', () => {
                it('should be available when response type is full admission and payment will be made by set date', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentBySetDateData }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined;
                });
                it('should be available when response type is full admission and payment will be made by instalments', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentByInstalmentsData }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).not.to.be.undefined;
                });
                it('should not be available when response type is full admission and payment will be made immediately', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithImmediatePaymentData() }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === 'Accept or reject their repayment plan')).to.be.undefined;
                });
            });
        });
        describe('"Free mediation?" task', () => {
            describe('when response type is part admission', () => {
                it('should be available when payment will be made by set date, defendant requested free mediation and claimant rejected response', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), {
                        response: Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), { freeMediation: 'yes' })
                    }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
                it('should be available when payment will be made by instalments, defendant requested free mediation and claimant rejected response', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), {
                        response: Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentByInstalmentsData), { freeMediation: 'yes' })
                    }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).not.to.be.undefined;
                });
                it('should be not available when defendant did not request free mediation and claimant rejected response', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), {
                        response: Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), { freeMediation: 'no' })
                    }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).to.be.undefined;
                });
                it('should be not available when defendant requested free mediation and claimant accepted response', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), {
                        response: Object.assign(Object.assign({}, responseData_1.partialAdmissionWithPaymentBySetDateData), { freeMediation: 'yes' })
                    }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        settleAdmitted: {
                            admitted: {
                                option: 'yes'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).to.be.undefined;
                });
            });
            describe('when response type is full admission', () => {
                it('should not be available', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentBySetDateData }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === mediationTaskLabel)).to.be.undefined;
                });
            });
        });
        describe('"Propose an alternative repayment plan" task', () => {
            const taskName = 'Propose an alternative repayment plan';
            describe('when response type is part admission', () => {
                it('should be available when payment will be made by set date and payment method is rejected by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined;
                });
                it('should be available when payment will be made by instalments and payment method is rejected by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentByInstalmentsData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined;
                });
                it('should not be available when payment method is accepted by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: {
                            accept: {
                                option: 'yes'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
                it('should not be available when payment will be made immediately', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithImmediatePaymentData() }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: undefined
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
                it('should not be available when payment was already made', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionAlreadyPaidData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: undefined
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
            });
            describe('when response type is full admission', () => {
                it('should be available when payment will be made by set date and payment method is rejected by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined;
                });
                it('should be available when payment will be made by instalments and payment method is rejected by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentByInstalmentsData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined;
                });
                it('should not be available when payment method is accepted by claimant', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        acceptPaymentMethod: {
                            accept: {
                                option: 'yes'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
                it('should not be available when payment will be made immediately', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithImmediatePaymentData() }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
            });
        });
        describe('"Request a County Court Judgment" task', () => {
            const taskName = 'Request a County Court Judgment';
            describe('when response type is part admission', () => {
                it('should be available when claimant decided to proceed with CCJ', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'requestCCJ',
                                displayValue: 'Request a County Court Judgment (CCJ)'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined;
                });
                it('should not be available when claimant decided to proceed with settlement', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'signSettlementAgreement',
                                displayValue: 'Sign a settlement agreement'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
            });
            describe('when response type is full admission', () => {
                it('should be available when claimant decided to proceed with CCJ', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentBySetDateData }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'requestCCJ',
                                displayValue: 'Request a County Court Judgment (CCJ)'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).not.to.be.undefined;
                });
                it('should not be available when claimant decided to proceed with settlement', () => {
                    claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithImmediatePaymentData() }));
                    draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'signSettlementAgreement',
                                displayValue: 'Sign a settlement agreement'
                            }
                        }
                    }));
                    const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                    chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
                });
            });
        });
        describe('"Formalise Repayment Plan task"', () => {
            const taskName = 'Choose how to formalise repayment';
            it('should render page with Formalise repayment plan task', () => {
                claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentByInstalmentsData }));
                draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                    rejectionReason: undefined
                }));
                const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.not.be.undefined;
            });
            it('should render page without Formalise repayment plan task when court offer is rejected', async () => {
                claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullAdmissionWithPaymentByInstalmentsData }));
                draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                    acceptPaymentMethod: {
                        accept: {
                            option: 'no'
                        }
                    }
                }));
                const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
                chai_1.expect(taskList.tasks.find(task => task.name === taskName)).to.be.undefined;
            });
        });
    });
    describe('"Your hearing requirements"', () => {
        it('response is partial admission', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.partialAdmissionWithPaymentByInstalmentsData }));
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                settleAdmitted: {
                    admitted: {
                        option: 'no'
                    }
                }
            }));
            claim.features = ['admissions', 'directionsQuestionnaire'];
            const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(draft, claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
            if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                chai_1.expect(taskList.name).to.contains('Your hearing requirements');
            }
            else {
                chai_1.expect(taskList).to.be.eq(undefined);
            }
        });
        it('response is full defence', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullDefenceData }));
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                intentionToProceed: {
                    proceed: {
                        option: 'yes'
                    }
                }
            }));
            claim.features = ['admissions', 'directionsQuestionnaire'];
            const taskList = taskListBuilder_1.TaskListBuilder.buildDirectionsQuestionnaireSection(draft, claim, new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
            if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                chai_1.expect(taskList.name).to.contains('Your hearing requirements');
            }
            else {
                chai_1.expect(taskList).to.be.eq(undefined);
            }
        });
        it('response is full defence with mediation', () => {
            claim = new claim_1.Claim().deserialize(Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { response: responseData_1.fullDefenceData }));
            draft = new draftClaimantResponse_1.DraftClaimantResponse().deserialize(Object.assign(Object.assign({}, draftStoreServiceMock.sampleClaimantResponseDraftObj), {
                intentionToProceed: {
                    proceed: {
                        option: 'yes'
                    }
                }
            }));
            claim.features = ['admissions', 'directionsQuestionnaire'];
            claim.response.freeMediation = yesNoOption_1.YesNoOption.YES;
            const taskList = taskListBuilder_1.TaskListBuilder.buildHowYouWantToRespondSection(draft, claim, new mediationDraft_1.MediationDraft());
            chai_1.expect(taskList.tasks.find(task => task.name === 'Free telephone mediation')).not.to.be.undefined;
        });
    });
    describe('"Submit" section', () => {
        it('should be available when claimant tries to respond', () => {
            const taskList = taskListBuilder_1.TaskListBuilder.buildSubmitSection(draft, claimStoreServiceMock.sampleClaimObj.externalId);
            chai_1.expect(taskList.tasks.find(task => task.name === 'Check and submit your response')).not.to.be.undefined;
        });
        it('should list all incomplete tasks when tries to respond', () => {
            const taskListItems = taskListBuilder_1.TaskListBuilder.buildRemainingTasks(draft, claim, new mediationDraft_1.MediationDraft(), new directionsQuestionnaireDraft_1.DirectionsQuestionnaireDraft());
            chai_1.expect(taskListItems.length).to.be.eq(2);
        });
    });
});
