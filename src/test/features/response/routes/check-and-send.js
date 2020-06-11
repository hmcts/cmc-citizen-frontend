"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const hooks_1 = require("test/routes/hooks");
require("test/routes/expectations");
const authorization_check_1 = require("test/common/checks/authorization-check");
const already_submitted_check_1 = require("test/common/checks/already-submitted-check");
const ccj_requested_check_1 = require("test/common/checks/ccj-requested-check");
const paths_1 = require("response/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const responseType_1 = require("response/form/models/responseType");
const signatureType_1 = require("common/signatureType");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const not_defendant_in_case_check_1 = require("test/common/checks/not-defendant-in-case-check");
const interestType_1 = require("claims/models/interestType");
const interestDateType_1 = require("common/interestDateType");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const responseData_1 = require("test/data/entity/responseData");
const featureToggles_1 = require("utils/featureToggles");
const momentFactory_1 = require("shared/momentFactory");
const alreadyPaidInFullGuard_1 = require("test/app/guards/alreadyPaidInFullGuard");
const cookieName = config.get('session.cookieName');
const draftType = 'response';
const pagePath = paths_1.Paths.checkAndSendPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId });
const claimWithDQ = Object.assign(Object.assign({}, claimStoreServiceMock.sampleClaimObj), { features: ['admissions', 'directionsQuestionnaire'] });
describe('Defendant response: check and send page', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    describe('on GET', () => {
        const method = 'get';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForGetWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                it('should redirect to incomplete submission when not all tasks are completed', async () => {
                    draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                it('should return 500 and render error page when cannot retrieve claim', async () => {
                    claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
                it('should render page when everything is fine', async () => {
                    draftStoreServiceMock.resolveFind(draftType);
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                    await request(app_1.app)
                        .get(pagePath)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers'));
                });
                context('for individual and sole traders', () => {
                    it('should return statement of truth with a tick box', async () => {
                        draftStoreServiceMock.resolveFind(draftType);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth'))
                            .expect(res => chai_1.expect(res).to.be.successful.withText('I believe that the facts stated in this response are true.'))
                            .expect(res => chai_1.expect(res).to.be.successful.withText('I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.'))
                            .expect(res => chai_1.expect(res).to.be.successful.withText('<input id="signedtrue" type="checkbox" name="signed" value="true"'));
                    });
                    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                        it('should load page with direction questionnaire information', async () => {
                            draftStoreServiceMock.resolveFind(draftType, { timeline: undefined, evidence: undefined });
                            draftStoreServiceMock.resolveFind('mediation');
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimWithDQ);
                            claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                            await request(app_1.app)
                                .get(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Your hearing requirements', 'Support required for a hearing', 'Preferred hearing centre', 'Have you already got a report written by an expert?', 'Does the claim involve something an expert can still examine?', 'What is there to examine?', 'Photographs', 'Do you want to give evidence?', 'Do you want the court’s permission to use an expert?', 'Other witnesses', 'Dates unavailable', 'Statement of truth', 'I believe that the facts stated in this response are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.', 'The hearing requirement details on this page are true to the best of my knowledge.', '<input id="signedtrue" type="checkbox" name="signed" value="true"', 'Your timeline of what happened', 'Your evidence'));
                        });
                    }
                });
                context('for company and organisation', () => {
                    it('should return statement of truth with a tick box', async () => {
                        draftStoreServiceMock.resolveFind('response:company', {
                            timeline: { rows: [{ date: 'timeline date', description: 'something awesome happened' }] }
                        });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        const claimStoreOverride = {
                            claim: {
                                claimants: [
                                    {
                                        type: 'company',
                                        name: 'John Smith Ltd',
                                        contactPerson: 'John Smith',
                                        address: {
                                            line1: 'line1',
                                            line2: 'line2',
                                            city: 'city',
                                            postcode: 'bb127nq'
                                        }
                                    }
                                ],
                                defendants: [
                                    {
                                        type: 'company',
                                        name: 'John Doe Ltd',
                                        contactPerson: 'John Doe',
                                        address: {
                                            line1: 'line1',
                                            line2: 'line2',
                                            city: 'city',
                                            postcode: 'bb127nq'
                                        }
                                    }
                                ],
                                payment: {
                                    id: '12',
                                    amount: 2500,
                                    state: { status: 'failed' }
                                },
                                amount: {
                                    type: 'breakdown',
                                    rows: [{ reason: 'Reason', amount: 200 }]
                                },
                                interest: {
                                    type: interestType_1.InterestType.STANDARD,
                                    rate: 10,
                                    reason: 'Special case',
                                    interestDate: {
                                        type: interestDateType_1.InterestDateType.SUBMISSION,
                                        endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                                    }
                                },
                                reason: 'Because I can',
                                feeAmountInPennies: 2500,
                                timeline: { rows: [{ date: 'a', description: 'b' }] }
                            }
                        };
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreOverride);
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        await request(app_1.app)
                            .get(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', '<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"', 'I believe that the facts stated in this response are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.', '<input id="signedtrue" type="checkbox" name="signed" value="true"', 'timeline date', 'something awesome happened'));
                    });
                    it('should return hearing requirement tick box', async () => {
                        draftStoreServiceMock.resolveFind('response:company', {
                            evidence: { rows: [{ type: 'PHOTO', description: 'photo of a cat' }], comment: 'their evidence is invalid' }
                        });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        const claimStoreOverride = {
                            features: ['admissions', 'directionsQuestionnaire'],
                            claim: {
                                claimants: [
                                    {
                                        type: 'company',
                                        name: 'John Smith Ltd',
                                        contactPerson: 'John Smith',
                                        address: {
                                            line1: 'line1',
                                            line2: 'line2',
                                            city: 'city',
                                            postcode: 'bb127nq'
                                        }
                                    }
                                ],
                                defendants: [
                                    {
                                        type: 'company',
                                        name: 'John Doe Ltd',
                                        contactPerson: 'John Doe',
                                        address: {
                                            line1: 'line1',
                                            line2: 'line2',
                                            city: 'city',
                                            postcode: 'bb127nq'
                                        }
                                    }
                                ],
                                payment: {
                                    id: '12',
                                    amount: 2500,
                                    state: { status: 'failed' }
                                },
                                amount: {
                                    type: 'breakdown',
                                    rows: [{ reason: 'Reason', amount: 200 }]
                                },
                                interest: {
                                    type: interestType_1.InterestType.STANDARD,
                                    rate: 10,
                                    reason: 'Special case',
                                    interestDate: {
                                        type: interestDateType_1.InterestDateType.SUBMISSION,
                                        endDateType: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                                    }
                                },
                                reason: 'Because I can',
                                feeAmountInPennies: 2500,
                                timeline: { rows: [{ date: 'a', description: 'b' }] }
                            }
                        };
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(claimStoreOverride);
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.PART_ADMISSION)) {
                            await request(app_1.app)
                                .get(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', '<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"', 'I believe that the facts stated in this response are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.', '<input id="signedtrue" type="checkbox" name="signed" value="true"', '<input id="directionsQuestionnaireSignedtrue" type="checkbox" name="directionsQuestionnaireSigned" value="true"', 'photo of a cat', 'their evidence is invalid'));
                        }
                        else {
                            await request(app_1.app)
                                .get(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Statement of truth', '<input id="signerName" name="signerName"', '<input id="signerRole" name="signerRole"', 'I believe that the facts stated in this response are true.', 'I understand that proceedings for contempt of court may be brought against anyone who makes, or causes to be made, a false statement in a document verified by a statement of truth without an honest belief in its truth.', '<input id="signedtrue" type="checkbox" name="signed" value="true"', 'photo of a cat', 'their evidence is invalid'));
                        }
                    });
                });
            });
        });
    });
    describe('on POST', () => {
        const method = 'post';
        authorization_check_1.checkAuthorizationGuards(app_1.app, method, pagePath);
        not_defendant_in_case_check_1.checkNotDefendantInCaseGuard(app_1.app, method, pagePath);
        context('when user authorised', () => {
            beforeEach(() => {
                idamServiceMock.resolveRetrieveUserFor(claimStoreServiceMock.sampleClaimObj.defendantId, 'citizen');
            });
            already_submitted_check_1.checkAlreadySubmittedGuard(app_1.app, method, pagePath);
            ccj_requested_check_1.checkCountyCourtJudgmentRequestedGuard(app_1.app, method, pagePath);
            alreadyPaidInFullGuard_1.verifyRedirectForPostWhenAlreadyPaidInFull(pagePath);
            context('when response not submitted', () => {
                it('should redirect to incomplete submission when not all tasks are completed', async () => {
                    draftStoreServiceMock.resolveFind(draftType, { defendantDetails: undefined });
                    draftStoreServiceMock.resolveFind('mediation');
                    draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                    claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                    claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                    await request(app_1.app)
                        .post(pagePath)
                        .send({ type: signatureType_1.SignatureType.BASIC })
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect
                        .toLocation(paths_1.Paths.incompleteSubmissionPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                });
                context('when form is invalid', () => {
                    it('should return 500 and render error page when cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .send({ type: signatureType_1.SignatureType.BASIC })
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should render page when everything is fine', async () => {
                        draftStoreServiceMock.resolveFind(draftType);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        await request(app_1.app)
                            .post(pagePath)
                            .send({ type: signatureType_1.SignatureType.BASIC })
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.successful.withText('Check your answers', 'div class="error-summary"'));
                    });
                    if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
                        it('should stay in check and send page with error when hearing requirement details not checked', async () => {
                            draftStoreServiceMock.resolveFind(draftType);
                            draftStoreServiceMock.resolveFind('mediation');
                            draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                            claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                            claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                            let sendData = { signed: 'true', type: signatureType_1.SignatureType.BASIC };
                            if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.PART_ADMISSION)) {
                                sendData = {
                                    signed: 'true',
                                    type: signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE
                                };
                            }
                            await request(app_1.app)
                                .post(pagePath)
                                .set('Cookie', `${cookieName}=ABC`)
                                .send(sendData)
                                .expect(res => chai_1.expect(res).to.be.successful.withText('Tell us if you believe the hearing requirement details on this page are true', 'div class="error-summary"'));
                        });
                    }
                });
                context('when form is valid', () => {
                    it('should return 500 and render error page when form is valid and cannot retrieve claim', async () => {
                        claimStoreServiceMock.rejectRetrieveClaimByExternalId('HTTP error');
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ signed: 'true', type: signatureType_1.SignatureType.BASIC })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when form is valid and cannot save response', async () => {
                        draftStoreServiceMock.resolveFind(draftType);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.rejectSaveResponse('HTTP error');
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ signed: 'true', type: signatureType_1.SignatureType.BASIC })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should return 500 and render error page when form is valid and cannot delete draft response', async () => {
                        draftStoreServiceMock.resolveFind(draftType);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolveSaveResponse();
                        draftStoreServiceMock.rejectDelete();
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ signed: 'true', type: signatureType_1.SignatureType.BASIC })
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to confirmation page when form is valid and a non handoff response type is picked', async () => {
                        draftStoreServiceMock.resolveFind(draftType);
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolveSaveResponse();
                        draftStoreServiceMock.resolveDelete();
                        draftStoreServiceMock.resolveDelete();
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        let sendData = { signed: 'true', type: signatureType_1.SignatureType.BASIC };
                        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.PART_ADMISSION)) {
                            sendData = {
                                signed: 'true',
                                type: signatureType_1.SignatureType.DIRECTION_QUESTIONNAIRE,
                                directionsQuestionnaireSigned: 'true'
                            };
                            draftStoreServiceMock.resolveDelete();
                        }
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send(sendData)
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to confirmation page when form is valid with SignatureType as qualified', async () => {
                        draftStoreServiceMock.resolveFind('response:company');
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire', { directionsQuestionnaire: undefined });
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId(responseData_1.fullAdmissionWithPaymentByInstalmentsDataCompany);
                        claimStoreServiceMock.resolveSaveResponse();
                        draftStoreServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveDelete();
                        draftStoreServiceMock.resolveDelete();
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire') && (draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.DEFENCE || draftStoreServiceMock.sampleResponseDraftObj.response.type === responseType_1.ResponseType.PART_ADMISSION)) {
                            draftStoreServiceMock.resolveDelete();
                        }
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ signed: 'true', type: signatureType_1.SignatureType.QUALIFIED, signerName: 'signer', signerRole: 'role' })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.confirmationPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                    it('should redirect to counter-claim hand off page when defendant is counter claiming', async () => {
                        draftStoreServiceMock.resolveFind(draftType, {
                            response: { type: responseType_1.ResponseType.DEFENCE },
                            rejectAllOfClaim: { option: rejectAllOfClaim_1.RejectAllOfClaimOption.COUNTER_CLAIM }
                        });
                        draftStoreServiceMock.resolveFind('mediation');
                        draftStoreServiceMock.resolveFind('directionsQuestionnaire');
                        claimStoreServiceMock.resolveRetrieveClaimByExternalId();
                        claimStoreServiceMock.resolvePostponedDeadline(momentFactory_1.MomentFactory.currentDateTime().add(14, 'days').toString());
                        await request(app_1.app)
                            .post(pagePath)
                            .set('Cookie', `${cookieName}=ABC`)
                            .send({ signed: 'true', type: signatureType_1.SignatureType.BASIC })
                            .expect(res => chai_1.expect(res).to.be.redirect
                            .toLocation(paths_1.Paths.counterClaimPage.evaluateUri({ externalId: claimStoreServiceMock.sampleClaimObj.externalId })));
                    });
                });
            });
        });
    });
});
