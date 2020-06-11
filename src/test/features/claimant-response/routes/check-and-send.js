"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/features/claimant-response/routes/checks/authorization-check");
const not_claimant_in_case_check_1 = require("test/features/claimant-response/routes/checks/not-claimant-in-case-check");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const paths_1 = require("claimant-response/paths");
const app_1 = require("main/app");
const momentFactory_1 = require("shared/momentFactory");
const localDate_1 = require("forms/models/localDate");
const rejectionReason_1 = require("claimant-response/form/models/rejectionReason");
const featureToggles_1 = require("utils/featureToggles");
const cookieName = config.get('session.cookieName');
const draftType = 'claimantResponse';
const defendantPartialAdmissionResponse = claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj;
const pagePath = paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const settlementRequest = {
    partyStatements: [{
            type: 'OFFER',
            madeBy: 'DEFENDANT',
            offer: {
                content: 'Daniel Murphy will pay the full amount, no later than 1 January 2019',
                completionDate: '2019-01-01T00:00:00.000'
            }
        }, {
            type: 'ACCEPTATION',
            madeBy: 'CLAIMANT'
        }]
};
describe('Claimant response: check and send page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when response submitted', () => {
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot retrieve draft', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.rejectFind('Error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should redirect to incomplete submission when not all tasks are completed', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind(draftType, { acceptPaymentMethod: undefined });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should render page when everything is fine along with court decision', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                    draftStoreServiceMock.resolveFind(draftType);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Court decision'));
                });
                it('should render page when everything is fine but without court decision', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.sampleFullAdmissionWithPaymentByInstalmentsResponseObj);
                    draftStoreServiceMock.resolveFind(draftType, { courtDetermination: undefined });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Court decision'));
                });
                it('should render page when everything fine when Comp/Org as Defendant admission is accepted ' +
                    'but payment plan is rejected to be paid IMMEDIATELY', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData);
                    draftStoreServiceMock.resolveFind(draftType, {
                        courtDetermination: undefined,
                        alternatePaymentMethod: {
                            paymentOption: {
                                option: {
                                    value: 'IMMEDIATELY',
                                    displayValue: 'Immediately'
                                }
                            }
                        },
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        },
                        settlementAgreement: {
                            signed: false
                        },
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'referToJudge',
                                displayValue: 'Refer to judge'
                            }
                        }
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('How would you like the defendant to pay', 'Immediately'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Court decision'));
                });
                it('should render page when everything fine when Comp/Org as Defendant admission is accepted ' +
                    'but payment plan is rejected to be paid BY SET DATE', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData);
                    draftStoreServiceMock.resolveFind(draftType, {
                        courtDetermination: undefined,
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        },
                        settlementAgreement: {
                            signed: false
                        },
                        alternatePaymentMethod: {
                            paymentOption: {
                                option: {
                                    value: 'BY_SPECIFIED_DATE',
                                    displayValue: 'By a set date'
                                }
                            },
                            paymentDate: {
                                date: localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().add(50, 'days'))
                            }
                        },
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'referToJudge',
                                displayValue: 'Refer to judge'
                            }
                        }
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('How would you like the defendant to pay', 'In full by'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Court decision'));
                });
                it('should render page when everything fine when Comp/Org as Defendant admission is accepted ' +
                    'but payment plan is rejected to be paid BY INSTALMENTS', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateCompanyData);
                    draftStoreServiceMock.resolveFind(draftType, {
                        courtDetermination: undefined,
                        acceptPaymentMethod: {
                            accept: {
                                option: 'no'
                            }
                        },
                        settlementAgreement: {
                            signed: false
                        },
                        formaliseRepaymentPlan: {
                            option: {
                                value: 'referToJudge',
                                displayValue: 'Refer to judge'
                            }
                        }
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('How would you like the defendant to pay', 'By instalments'))
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Regular payments of', 'Frequency of payments', 'Date for first instalment'))
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Court decision'));
                });
                it('should redirect to incomplete submission when response is accepted but rest is incomplete', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind(draftType, {
                        settleAdmitted: {
                            admitted: {
                                option: 'yes'
                            }
                        },
                        acceptPaymentMethod: undefined,
                        formaliseRepaymentPlan: undefined,
                        settlementAgreement: undefined,
                        freeMediation: undefined,
                        rejectionReason: undefined,
                        alternatePaymentMethod: undefined,
                        courtOfferedPaymentIntention: undefined
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should render page successfully when Defendant`s response is rejected', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(defendantPartialAdmissionResponse);
                    draftStoreServiceMock.resolveFind(draftType, {
                        settleAdmitted: {
                            admitted: {
                                option: 'no'
                            }
                        },
                        acceptPaymentMethod: undefined,
                        formaliseRepaymentPlan: undefined,
                        settlementAgreement: undefined,
                        freeMediation: undefined,
                        rejectionReason: undefined,
                        alternatePaymentMethod: {
                            paymentOption: {
                                option: {
                                    value: 'INSTALMENTS',
                                    displayValue: 'By instalments'
                                }
                            },
                            paymentPlan: {
                                totalAmount: 3326.59,
                                instalmentAmount: 10,
                                firstPaymentDate: localDate_1.LocalDate.fromMoment(momentFactory_1.MomentFactory.currentDate().add(50, 'days')),
                                paymentSchedule: {
                                    value: 'EACH_WEEK',
                                    displayValue: 'Each week'
                                }
                            }
                        },
                        courtDetermination: {
                            courtDecision: {
                                paymentOption: {
                                    value: 'INSTALMENTS'
                                },
                                repaymentPlan: {
                                    instalmentAmount: 4.3333335,
                                    firstPaymentDate: '2019-01-01T00:00:00.000',
                                    paymentSchedule: 'EVERY_MONTH',
                                    completionDate: momentFactory_1.MomentFactory.parse('2039-05-08T00:00:00.000'),
                                    paymentLength: '20 years 5 months'
                                }
                            },
                            rejectionReason: {
                                text: 'i reject repayment plan because ...'
                            }
                        },
                        courtOfferedPaymentIntention: undefined
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'));
                });
                it(`should render page successfully when Defendant's part admit pay immediately response is accepted`, async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData());
                    draftStoreServiceMock.resolveFind(draftType, {
                        settleAdmitted: {
                            admitted: {
                                option: 'yes'
                            }
                        },
                        acceptPaymentMethod: undefined,
                        formaliseRepaymentPlan: undefined,
                        settlementAgreement: undefined,
                        freeMediation: undefined,
                        rejectionReason: undefined,
                        alternatePaymentMethod: undefined,
                        courtOfferedPaymentIntention: undefined
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'));
                });
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    it(`should render page with hearing requirements when Defendant's part admit pay immediately response is rejected`, async () => {
                        const dqPartAdmit = Object.assign(Object.assign({}, claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData()), { features: ['directionsQuestionnaire'] });
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit);
                        draftStoreServiceMock.resolveFind(draftType, {
                            settleAdmitted: {
                                admitted: {
                                    option: 'no'
                                }
                            },
                            acceptPaymentMethod: undefined,
                            formaliseRepaymentPlan: undefined,
                            settlementAgreement: undefined,
                            freeMediation: undefined,
                            rejectionReason: undefined,
                            alternatePaymentMethod: undefined,
                            courtOfferedPaymentIntention: undefined
                        });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Your hearing requirements'));
                    });
                }
                it(`should render page without hearing requirements when Defendant's part admit pay immediately response is accepted`, async () => {
                    const dqPartAdmit = Object.assign(Object.assign({}, claimStoreServiceMock.samplePartialAdmissionWithPayImmediatelyData()), { features: ['directionsQuestionnaire'] });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit);
                    draftStoreServiceMock.resolveFind(draftType, {
                        settleAdmitted: {
                            admitted: {
                                option: 'yes'
                            }
                        },
                        acceptPaymentMethod: undefined,
                        formaliseRepaymentPlan: undefined,
                        settlementAgreement: undefined,
                        freeMediation: undefined,
                        rejectionReason: undefined,
                        alternatePaymentMethod: undefined,
                        courtOfferedPaymentIntention: undefined
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Your hearing requirements'));
                });
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    it(`should render page with hearing requirements when Defendant's full defence response is rejected`, async () => {
                        const dqPartAdmit = Object.assign(Object.assign({}, claimStoreServiceMock.sampleFullDefenceRejectEntirely), { features: ['directionsQuestionnaire'] });
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit);
                        draftStoreServiceMock.resolveFind(draftType, {
                            intentionToProceed: {
                                proceed: {
                                    option: 'yes'
                                }
                            },
                            acceptPaymentMethod: undefined,
                            formaliseRepaymentPlan: undefined,
                            settlementAgreement: undefined,
                            freeMediation: undefined,
                            rejectionReason: undefined,
                            alternatePaymentMethod: undefined,
                            courtOfferedPaymentIntention: undefined
                        });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Your hearing requirements'));
                    });
                }
                it(`should render page without hearing requirements when Defendant's full defence response is accepted`, async () => {
                    const dqPartAdmit = Object.assign(Object.assign({}, claimStoreServiceMock.sampleFullDefenceRejectEntirely), { features: ['directionsQuestionnaire'] });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit);
                    draftStoreServiceMock.resolveFind(draftType, {
                        intentionToProceed: {
                            proceed: {
                                option: 'no'
                            }
                        },
                        acceptPaymentMethod: undefined,
                        formaliseRepaymentPlan: undefined,
                        settlementAgreement: undefined,
                        freeMediation: undefined,
                        rejectionReason: undefined,
                        alternatePaymentMethod: undefined,
                        courtOfferedPaymentIntention: undefined
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Your hearing requirements'));
                });
                if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                    it(`should render page with hearing requirements when Defendant's already paid response is rejected`, async () => {
                        const dqPartAdmit = Object.assign(Object.assign({}, claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount), { features: ['directionsQuestionnaire'] });
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit);
                        draftStoreServiceMock.resolveFind(draftType, {
                            accepted: {
                                accepted: {
                                    option: 'no'
                                }
                            },
                            rejectionReason: new rejectionReason_1.RejectionReason('already paid'),
                            formaliseRepaymentPlan: undefined,
                            settlementAgreement: undefined,
                            freeMediation: undefined,
                            alternatePaymentMethod: undefined,
                            courtOfferedPaymentIntention: undefined
                        });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Your hearing requirements'));
                    });
                }
                it(`should render page without hearing requirements when Defendant's already paid response is accepted`, async () => {
                    const dqPartAdmit = Object.assign(Object.assign({}, claimStoreServiceMock.sampleFullDefenceWithStatesPaidGreaterThanClaimAmount), { features: ['directionsQuestionnaire'] });
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(dqPartAdmit);
                    draftStoreServiceMock.resolveFind(draftType, {
                        accepted: {
                            accepted: {
                                option: 'yes'
                            }
                        },
                        rejectionReason: undefined,
                        formaliseRepaymentPlan: undefined,
                        settlementAgreement: undefined,
                        freeMediation: undefined,
                        alternatePaymentMethod: undefined,
                        courtOfferedPaymentIntention: undefined
                    });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withoutText('Your hearing requirements'));
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_claimant_in_case_check_1.checkNotClaimantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.submitterId, 'citizen');
            });
            context('when claimant response not submitted', () => {
                it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when cannot save claimant response', async () => {
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj);
                    draftStoreServiceMock.resolveFind(draftType);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    claimStoreServiceMock.rejectSaveClaimantResponse('HTTP error');
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send({})
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should return 500 and render error page when form is valid and cannot delete draft response', async () => {
                    draftStoreServiceMock.resolveFind(draftType);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj);
                    claimStoreServiceMock.resolveClaimantResponse();
                    draftStoreServiceMock.rejectDelete();
                    await request(app_1.app)
                        .post(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .send(settlementRequest)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
            it('should redirect to confirmation page when saved claimant response', async () => {
                draftStoreServiceMock.resolveFind(draftType);
                draftStoreServiceMock.resolveFind('mediation');
                draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreServiceMock.samplePartialAdmissionWithPaymentBySetDateResponseObj);
                draftStoreServiceMock.resolveDelete();
                draftStoreServiceMock.resolveDelete();
                claimStoreServiceMock.resolveClaimantResponse();
                await request(app_1.app)
                    .post(pagePath)
                    .set('Cookie', `${cookieName}=ABC`)
                    .send(settlementRequest)
                    .expect(res => chai_1.expect(res).to.be.redirect
                    .toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
            });
        });
    });
});
