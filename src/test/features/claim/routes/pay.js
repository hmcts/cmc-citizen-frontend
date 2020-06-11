"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
const config = require("config");
const paths_1 = require("claim/paths");
const app_1 = require("main/app");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreServiceMock = require("test/http-mocks/draft-store");
const claimStoreServiceMock = require("test/http-mocks/claim-store");
const feesServiceMock = require("test/http-mocks/fees");
const payServiceMock = require("test/http-mocks/pay");
const hooks_1 = require("test/routes/hooks");
const authorization_check_1 = require("test/features/claim/routes/checks/authorization-check");
const eligibility_check_1 = require("test/features/claim/routes/checks/eligibility-check");
const interestType_1 = require("claim/form/models/interestType");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const interestDateType_1 = require("common/interestDateType");
const yesNoOption_1 = require("models/yesNoOption");
const ts_mockito_1 = require("ts-mockito");
const launchDarklyClient_1 = require("shared/clients/launchDarklyClient");
const user_1 = require("idam/user");
const mockLaunchDarklyClient = ts_mockito_1.mock(launchDarklyClient_1.LaunchDarklyClient);
const draftType = 'claim';
const cookieName = config.get('session.cookieName');
const event = config.get('fees.issueFee.event');
const channel = config.get('fees.channel.online');
const failureMessage = 'failure message';
const externalId = draftStoreServiceMock.sampleClaimDraftObj.externalId;
let overrideClaimDraftObj;
let testRoles;
let testUser;
describe('Claim issue: initiate payment receiver', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.startPaymentReceiver.uri);
    eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.startPaymentReceiver.uri);
    describe('for authorized user', () => {
        beforeEach(() => {
            overrideClaimDraftObj = {
                externalId: externalId,
                readResolveDispute: true,
                readCompletingClaim: true,
                claimant: {
                    partyDetails: {
                        type: 'individual',
                        name: 'John Smith',
                        address: {
                            line1: 'Apt 99',
                            city: 'London',
                            postcode: 'E1'
                        },
                        hasCorrespondenceAddress: false,
                        dateOfBirth: {
                            known: true,
                            date: {
                                day: 31,
                                month: 12,
                                year: 1980
                            }
                        }
                    },
                    phone: {
                        number: '07000000000'
                    },
                    payment: {
                        reference: '123',
                        date_created: 12345,
                        amount: 2500,
                        status: 'Success',
                        _links: {
                            next_url: {
                                href: 'any href',
                                method: 'POST'
                            }
                        }
                    }
                },
                defendant: {
                    partyDetails: {
                        type: 'individual',
                        name: 'Rose Smith',
                        address: {
                            line1: 'Apt 99',
                            city: 'London',
                            postcode: 'E1'
                        },
                        hasCorrespondenceAddress: false
                    },
                    email: { address: 'example@example.com' }
                },
                amount: {
                    rows: [{ reason: 'Valid reason', amount: 1 }]
                },
                interest: {
                    option: yesNoOption_1.YesNoOption.YES
                },
                interestType: {
                    option: interestType_1.InterestTypeOption.SAME_RATE
                },
                interestRate: {
                    type: interestRateOption_1.InterestRateOption.DIFFERENT,
                    rate: 10,
                    reason: 'Special case'
                },
                interestDate: {
                    type: interestDateType_1.InterestDateType.SUBMISSION
                },
                interestStartDate: {
                    date: {
                        day: 10,
                        month: 12,
                        year: 2016
                    },
                    reason: 'reason'
                },
                interestEndDate: {
                    option: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                },
                reason: {
                    reason: 'Valid reason'
                }
            };
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
        });
        it('should return 500 and error page when draft external ID does not exist', async () => {
            draftStoreServiceMock.resolveFind(draftType, { externalId: undefined, claimant: { payment: undefined } });
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should return 500 and error page when cannot calculate issue fee', async () => {
            overrideClaimDraftObj.claimant.payment = undefined;
            draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj);
            feesServiceMock.rejectCalculateFee(event, channel, failureMessage);
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should return 500 and error page when cannot retrieve service token needed for payment service', async () => {
            overrideClaimDraftObj.claimant.payment = undefined;
            draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj);
            feesServiceMock.resolveCalculateFee(event, channel);
            idamServiceMock.rejectRetrieveServiceToken();
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should return 500 and error page when cannot create payment', async () => {
            overrideClaimDraftObj.claimant.payment = undefined;
            draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj);
            feesServiceMock.resolveCalculateFee(event, channel);
            idamServiceMock.resolveRetrieveServiceToken();
            payServiceMock.rejectCreate();
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should return 500 and error page when cannot save draft', async () => {
            overrideClaimDraftObj.claimant.payment = undefined;
            draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj);
            feesServiceMock.resolveCalculateFee(event, channel);
            idamServiceMock.resolveRetrieveServiceToken();
            payServiceMock.resolveCreate();
            draftStoreServiceMock.rejectUpdate();
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should initiate new payment and redirect to next page when payment does not exist for given reference', async () => {
            overrideClaimDraftObj.claimant.payment.state = {
                status: 'success'
            };
            idamServiceMock.resolveRetrieveServiceToken();
            draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj);
            payServiceMock.resolveRetrieveToNotFound();
            feesServiceMock.resolveCalculateFee(event, channel);
            payServiceMock.resolveCreate();
            draftStoreServiceMock.resolveUpdate();
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation('https://www.payments.service.gov.uk/secure/8b647ade-02cc-4c85-938d-4db560404df8'));
        });
        it('should redirect to next page when everything is fine', async () => {
            overrideClaimDraftObj.claimant.payment = undefined;
            draftStoreServiceMock.resolveFind(draftType, overrideClaimDraftObj);
            feesServiceMock.resolveCalculateFee(event, channel);
            idamServiceMock.resolveRetrieveServiceToken();
            payServiceMock.resolveCreate();
            draftStoreServiceMock.resolveUpdate();
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation('https://www.payments.service.gov.uk/secure/8b647ade-02cc-4c85-938d-4db560404df8'));
        });
        it('should redirect to pay receiver page when pay status is success', async () => {
            draftStoreServiceMock.resolveFind(draftType);
            idamServiceMock.resolveRetrieveServiceToken();
            payServiceMock.resolveRetrieve('Success');
            await request(app_1.app)
                .get(paths_1.Paths.startPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId })));
        });
    });
});
describe('Claim issue: post payment callback receiver', () => {
    hooks_1.attachDefaultHooks(app_1.app);
    authorization_check_1.checkAuthorizationGuards(app_1.app, 'get', paths_1.Paths.finishPaymentReceiver.uri);
    eligibility_check_1.checkEligibilityGuards(app_1.app, 'get', paths_1.Paths.finishPaymentReceiver.uri);
    describe('for authorized user', () => {
        beforeEach(() => {
            overrideClaimDraftObj = {
                externalId: externalId,
                readResolveDispute: true,
                readCompletingClaim: true,
                claimant: {
                    partyDetails: {
                        type: 'individual',
                        name: 'John Smith',
                        address: {
                            line1: 'Apt 99',
                            city: 'London',
                            postcode: 'E1'
                        },
                        hasCorrespondenceAddress: false,
                        dateOfBirth: {
                            known: true,
                            date: {
                                day: 31,
                                month: 12,
                                year: 1980
                            }
                        }
                    },
                    phone: {
                        number: '07000000000'
                    },
                    payment: {
                        reference: '123',
                        date_created: 12345,
                        amount: 2500,
                        status: 'Success',
                        _links: { next_url: { href: 'any href', method: 'POST' } }
                    }
                },
                defendant: {
                    partyDetails: {
                        type: 'individual',
                        name: 'Rose Smith',
                        address: {
                            line1: 'Apt 99',
                            city: 'London',
                            postcode: 'E1'
                        },
                        hasCorrespondenceAddress: false
                    },
                    email: { address: 'example@example.com' }
                },
                amount: {
                    rows: [{ reason: 'Valid reason', amount: 1 }]
                },
                interest: {
                    option: yesNoOption_1.YesNoOption.YES
                },
                interestType: {
                    option: interestType_1.InterestTypeOption.SAME_RATE
                },
                interestRate: {
                    type: interestRateOption_1.InterestRateOption.DIFFERENT,
                    rate: 10,
                    reason: 'Special case'
                },
                interestDate: {
                    type: interestDateType_1.InterestDateType.SUBMISSION
                },
                interestStartDate: {
                    date: {
                        day: 10,
                        month: 12,
                        year: 2016
                    },
                    reason: 'reason'
                },
                interestEndDate: {
                    option: interestEndDate_1.InterestEndDateOption.SETTLED_OR_JUDGMENT
                },
                reason: {
                    reason: 'Valid reason'
                }
            };
            idamServiceMock.resolveRetrieveUserFor('1', 'citizen');
            testRoles = ['testRole1', 'testRole2'];
            testUser = new user_1.User('testId', '', '', '', testRoles, '', '');
        });
        it('should return 500 and error page when cannot retrieve payment', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
            idamServiceMock.resolveRetrieveServiceToken();
            payServiceMock.rejectRetrieve();
            await request(app_1.app)
                .get(paths_1.Paths.finishPaymentReceiver.evaluateUri({ externalId: 'xyz' }))
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        it('should return 500 and error page when cannot retrieve payment', async () => {
            draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
            idamServiceMock.resolveRetrieveServiceToken();
            payServiceMock.resolveRetrieve('Success');
            draftStoreServiceMock.rejectUpdate();
            await request(app_1.app)
                .get(paths_1.Paths.finishPaymentReceiver.uri)
                .set('Cookie', `${cookieName}=ABC`)
                .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
        });
        describe('when retrieved payment', () => {
            describe('failed', () => {
                it('should redirect to the check and send page', async () => {
                    draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                    idamServiceMock.resolveRetrieveServiceToken();
                    payServiceMock.resolveRetrieve('Failed');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .get(paths_1.Paths.finishPaymentReceiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.checkAndSendPage.uri));
                });
            });
            describe('got cancelled', () => {
                it('should redirect to the check and send page', async () => {
                    draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                    idamServiceMock.resolveRetrieveServiceToken();
                    payServiceMock.resolveRetrieve('Cancelled');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .get(paths_1.Paths.finishPaymentReceiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.redirect.toLocation(paths_1.Paths.checkAndSendPage.uri));
                });
            });
            describe('succeeded', () => {
                describe('when claim already exists', () => {
                    it('should return 500 and render error page when cannot delete draft', async () => {
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        payServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveSaveClaimForUser();
                        draftStoreServiceMock.rejectDelete();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to confirmation page when everything is fine', async () => {
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                        claimStoreServiceMock.rejectSaveClaimForUser('reason', 409);
                        claimStoreServiceMock.resolveRetrieveByExternalId();
                        payServiceMock.resolveUpdate();
                        draftStoreServiceMock.resolveDelete();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`));
                    });
                    it('should redirect to confirmation page when payment is missing', async () => {
                        draftStoreServiceMock.resolveFind(draftType, { claimant: undefined });
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.evaluateUri({ externalId: externalId }))
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`));
                    });
                });
                describe('when claim does not exist', () => {
                    it('should return 500 and render error page when cannot save claim', async () => {
                        ts_mockito_1.when(mockLaunchDarklyClient.variation(testUser, testRoles, 'admissions', false)).thenResolve(Promise.resolve(false));
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                        claimStoreServiceMock.rejectSaveClaimForUser();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                        ts_mockito_1.reset(mockLaunchDarklyClient);
                    });
                    it('should return 500 and render error page when cannot delete draft', async () => {
                        ts_mockito_1.when(mockLaunchDarklyClient.variation(testUser, testRoles, 'admissions', false)).thenResolve(Promise.resolve(false));
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                        claimStoreServiceMock.resolveSaveClaimForUser();
                        payServiceMock.resolveUpdate();
                        draftStoreServiceMock.rejectDelete();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                        ts_mockito_1.reset(mockLaunchDarklyClient);
                    });
                    it('should return 500 and render error page when feature toggle api fails', async () => {
                        ts_mockito_1.when(mockLaunchDarklyClient.variation(testUser, testRoles, 'admissions', false)).thenResolve(Promise.resolve(false));
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError);
                        ts_mockito_1.reset(mockLaunchDarklyClient);
                    });
                    it('should return 500 and render error page when retrieve user roles fails', async () => {
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.rejectRetrieveUserRoles();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                    });
                    it('should redirect to confirmation page when everything is fine', async () => {
                        ts_mockito_1.when(mockLaunchDarklyClient.variation(testUser, testRoles, 'admissions', false)).thenResolve(Promise.resolve(false));
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-given');
                        claimStoreServiceMock.resolveSaveClaimForUser();
                        draftStoreServiceMock.resolveDelete();
                        payServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`));
                        ts_mockito_1.reset(mockLaunchDarklyClient);
                    });
                    it('should redirect to confirmation page when user have not given any consent', async () => {
                        ts_mockito_1.when(mockLaunchDarklyClient.variation(testUser, testRoles, 'admissions', false)).thenResolve(Promise.resolve(false));
                        draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                        idamServiceMock.resolveRetrieveServiceToken();
                        payServiceMock.resolveRetrieve('Success');
                        draftStoreServiceMock.resolveUpdate();
                        claimStoreServiceMock.resolveRetrieveUserRoles('cmc-new-features-consent-not-given');
                        claimStoreServiceMock.resolveSaveClaimForUser();
                        draftStoreServiceMock.resolveDelete();
                        payServiceMock.resolveUpdate();
                        await request(app_1.app)
                            .get(paths_1.Paths.finishPaymentReceiver.uri)
                            .set('Cookie', `${cookieName}=ABC`)
                            .expect(res => chai_1.expect(res).to.be.redirect.toLocation(`/claim/${externalId}/confirmation`));
                        ts_mockito_1.reset(mockLaunchDarklyClient);
                    });
                });
            });
            describe('has unknown status', () => {
                it('should return 500 and render error page', async () => {
                    draftStoreServiceMock.resolveFind(draftType, payServiceMock.paymentInitiateResponse);
                    idamServiceMock.resolveRetrieveServiceToken();
                    payServiceMock.resolveRetrieve('unknown');
                    draftStoreServiceMock.resolveUpdate();
                    await request(app_1.app)
                        .get(paths_1.Paths.finishPaymentReceiver.uri)
                        .set('Cookie', `${cookieName}=ABC`)
                        .expect(res => chai_1.expect(res).to.be.serverError.withText('Error'));
                });
            });
        });
    });
});
