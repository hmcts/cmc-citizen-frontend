"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mock = require("mock-require");
const idamServiceMock = require("test/http-mocks/idam");
const draftStoreMock = require("test/http-mocks/draft-store");
const claimStoreMock = require("test/http-mocks/claim-store");
const feesMock = require("test/http-mocks/fees");
const claim_1 = require("claims/models/claim");
const responseData_1 = require("test/data/entity/responseData");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const courtFinderMock = require("../http-mocks/court-finder-client");
const momentFactory_1 = require("shared/momentFactory");
idamServiceMock.resolveRetrieveUserFor('1', 'citizen', 'letter-holder').persist();
idamServiceMock.resolveRetrieveServiceToken().persist();
draftStoreMock.resolveFindAllDrafts().persist();
claimStoreMock.resolvePostponedDeadline('2020-01-01').persist();
claimStoreMock.resolveRetrieveByLetterHolderId('000MC000').persist();
claimStoreMock.resolveRetrieveClaimByExternalId({
    respondedAt: '2017-08-07T15:27:34.654',
    claimantRespondedAt: momentFactory_1.MomentFactory.parse('2017-09-09'),
    response: Object.assign(Object.assign(Object.assign(Object.assign({}, responseData_1.defenceWithDisputeData), responseData_1.fullAdmissionWithPaymentByInstalmentsData), responseData_1.partialAdmissionWithPaymentByInstalmentsData), { statementOfMeans: Object.assign({}, responseData_1.statementOfMeansWithMandatoryFieldsOnlyData) }),
    countyCourtJudgmentRequestedAt: '2017-10-10T22:45:51.785',
    countyCourtJudgment: {
        defendantDateOfBirth: '1990-11-01',
        paidAmount: 2,
        paymentOption: 'INSTALMENTS',
        repaymentPlan: {
            instalmentAmount: 30,
            firstPaymentDate: '2018-11-11',
            paymentSchedule: 'EVERY_MONTH',
            completionDate: '2019-11-11',
            paymentLength: '12 months'
        },
        ccjType: countyCourtJudgmentType_1.CountyCourtJudgmentType.DETERMINATION
    },
    settlementReachedAt: '2017-08-10T15:27:32.917',
    claimantResponse: {
        type: claimantResponseType_1.ClaimantResponseType.ACCEPTATION,
        amountPaid: 0
    },
    reDeterminationRequestedAt: '2018-12-01T12:34:56.789'
}).persist();
claimStoreMock.mockCalculateInterestRate(0).persist();
claimStoreMock.resolveRetrieveUserRoles('cmc-new-features-consent-given').persist();
claimStoreMock.mockNextWorkingDay(momentFactory_1.MomentFactory.parse('2019-01-01')).persist();
feesMock.resolveCalculateIssueFee().persist();
feesMock.resolveCalculateHearingFee().persist();
feesMock.resolveGetIssueFeeRangeGroup().persist();
feesMock.resolveGetHearingFeeRangeGroup().persist();
courtFinderMock.resolveFind().persist();
courtFinderMock.resolveCourtDetails().persist();
const justForwardRequestHandler = {
    requestHandler: (req, res, next) => {
        next();
    }
};
mock('first-contact/guards/claimReferenceMatchesGuard', {
    ClaimReferenceMatchesGuard: {
        requestHandler: (req, res, next) => {
            res.locals.claim = new claim_1.Claim().deserialize(claimStoreMock.sampleClaimObj);
            next();
        }
    }
});
mock('claim/guards/allClaimTasksCompletedGuard', {
    AllClaimTasksCompletedGuard: justForwardRequestHandler
});
mock('response/guards/moreTimeAlreadyRequestedGuard', {
    MoreTimeAlreadyRequestedGuard: justForwardRequestHandler
});
mock('response/guards/moreTimeRequestRequiredGuard', {
    MoreTimeRequestRequiredGuard: justForwardRequestHandler
});
mock('response/guards/oweNoneResponseRequiredGuard', {
    OweNoneResponseRequiredGuard: justForwardRequestHandler
});
mock('response/guards/countyCourtJudgmentRequestedGuard', {
    CountyCourtJudgmentRequestedGuard: justForwardRequestHandler
});
mock('response/guards/allResponseTasksCompletedGuard', {
    AllResponseTasksCompletedGuard: justForwardRequestHandler
});
mock('ccj/guards/ccjGuard', {
    CCJGuard: justForwardRequestHandler
});
mock('offer/guards/offerGuard', {
    OfferGuard: justForwardRequestHandler
});
mock('directions-questionnaire/guard/directionsQuestionnaireGuard', {
    DirectionsQuestionnaireGuard: justForwardRequestHandler
});
mock('response/guards/guardFactory', {
    GuardFactory: {
        create: () => {
            return (req, res, next) => {
                next();
            };
        },
        createAsync: () => {
            return async (req, res, next) => {
                next();
            };
        }
    }
});
