"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const mock = require("nock");
const HttpStatus = require("http-status-codes");
const responseType_1 = require("response/form/models/responseType");
const freeMediation_1 = require("forms/models/freeMediation");
const moreTimeNeeded_1 = require("response/form/models/moreTimeNeeded");
const interestRateOption_1 = require("features/claim/form/models/interestRateOption");
const localDate_1 = require("forms/models/localDate");
const yesNoOption_1 = require("ccj/form/models/yesNoOption");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const interestDateType_1 = require("common/interestDateType");
const interestType_1 = require("claim/form/models/interestType");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const claimValue_1 = require("eligibility/model/claimValue");
const yesNoOption_2 = require("models/yesNoOption");
const evidenceType_1 = require("forms/models/evidenceType");
const claimType_1 = require("eligibility/model/claimType");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const howMuchHaveYouPaid_1 = require("response/form/models/howMuchHaveYouPaid");
const momentFactory_1 = require("shared/momentFactory");
const moment = require("moment");
const serviceBaseURL = `${config.get('draft-store.url')}`;
exports.samplePaidInFullDraftObj = {
    datePaid: moment()
};
exports.sampleOrganisationDetails = {
    type: 'organisation',
    name: 'John Smith',
    address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' },
    hasCorrespondenceAddress: false,
    contactPerson: 'Mary Richards'
};
const commonClaimObject = {
    externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
    eligibility: {
        claimValue: claimValue_1.ClaimValue.UNDER_10000,
        helpWithFees: yesNoOption_2.YesNoOption.NO,
        claimantAddress: yesNoOption_2.YesNoOption.YES,
        defendantAddress: yesNoOption_2.YesNoOption.YES,
        eighteenOrOver: yesNoOption_2.YesNoOption.YES,
        defendantAge: defendantAgeOption_1.DefendantAgeOption.YES,
        claimType: claimType_1.ClaimType.PERSONAL_CLAIM,
        singleDefendant: yesNoOption_2.YesNoOption.NO,
        governmentDepartment: yesNoOption_2.YesNoOption.NO,
        claimIsForTenancyDeposit: yesNoOption_2.YesNoOption.NO
    },
    readResolveDispute: true,
    readCompletingClaim: true,
    amount: {
        rows: [
            {
                reason: 'Valid reason',
                amount: 1
            }
        ]
    },
    interest: {
        option: yesNoOption_2.YesNoOption.YES
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
    },
    timeline: {
        rows: [{ date: 'aaa', description: 'bb' }]
    },
    evidence: {
        rows: [{ type: evidenceType_1.EvidenceType.OTHER, description: 'bb' }]
    }
};
const commonIndividualClaimant = {
    claimant: {
        partyDetails: {
            type: 'individual',
            name: 'John Smith',
            address: {
                line1: 'Apt 99',
                line2: '',
                line3: '',
                city: 'London',
                postcode: 'bb127nq'
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
    }
};
const commonIndividualClaimantIOC = {
    claimant: {
        partyDetails: {
            type: 'individual',
            name: 'John Smith',
            address: {
                line1: 'Apt 99',
                line2: '',
                line3: '',
                city: 'London',
                postcode: 'bb127nq'
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
        }
    }
};
const commonCompanyClaimant = {
    claimant: {
        partyDetails: {
            type: 'company',
            name: 'Monsters Inc.',
            contactPerson: 'Sully',
            address: {
                line1: 'Apartment 99',
                line2: '',
                line3: '',
                city: 'London',
                postcode: 'SE28 0JE'
            },
            hasCorrespondenceAddress: false
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
    }
};
exports.aboveAllowedAmountWithInterest = {
    amount: {
        rows: [
            {
                reason: 'Valid reason',
                amount: 9800
            }
        ]
    },
    interest: {
        option: yesNoOption_2.YesNoOption.YES
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
        type: interestDateType_1.InterestDateType.CUSTOM
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
    }
};
const commonIndividualDefendant = {
    defendant: {
        partyDetails: {
            type: 'individual',
            firstName: 'Rose',
            lastName: 'Smith',
            address: {
                line1: 'Apt 99',
                line2: '',
                line3: '',
                city: 'London',
                postcode: 'bb127nq'
            },
            hasCorrespondenceAddress: false
        },
        email: { address: 'example@example.com' },
        phone: { number: '07799889988' }
    }
};
exports.sampleClaimDraftObj = Object.assign(Object.assign(Object.assign({}, commonClaimObject), commonIndividualClaimant), commonIndividualDefendant);
exports.sampleClaimDraftObjIOC = Object.assign(Object.assign(Object.assign({}, commonClaimObject), commonIndividualClaimantIOC), commonIndividualDefendant);
exports.sampleCompanyClaimDraftObj = Object.assign(Object.assign(Object.assign({}, commonClaimObject), commonCompanyClaimant), commonIndividualDefendant);
const commonIndividualResponsePartial = {
    defendantDetails: {
        email: { address: 'example@example.com' },
        phone: { number: '01223344444' },
        partyDetails: {
            type: 'individual',
            firstName: 'John',
            lastName: 'Smith',
            address: { line1: 'Apartment 99', line2: '', line3: '', city: 'London', postcode: 'SE28 0JE' },
            hasCorrespondenceAddress: false,
            dateOfBirth: {
                known: true,
                date: {
                    day: 31,
                    month: 12,
                    year: 1980
                }
            }
        }
    },
    moreTimeNeeded: {
        option: moreTimeNeeded_1.MoreTimeNeededOption.YES
    }
};
const commonCompanyResponsePartial = {
    defendantDetails: {
        email: { address: 'example@example.com' },
        phone: { number: '01223344444' },
        partyDetails: {
            type: 'company',
            name: 'Monsters Inc.',
            contactPerson: 'Sully',
            address: {
                line1: 'Apartment 99',
                line2: '',
                line3: '',
                city: 'London',
                postcode: 'SE28 0JE'
            },
            hasCorrespondenceAddress: false
        }
    },
    moreTimeNeeded: {
        option: moreTimeNeeded_1.MoreTimeNeededOption.YES
    }
};
const commonDefenceResponse = {
    response: {
        type: responseType_1.ResponseType.DEFENCE
    },
    rejectAllOfClaim: {
        option: rejectAllOfClaim_1.RejectAllOfClaimOption.DISPUTE
    },
    defence: {
        text: 'Some valid defence'
    },
    timeline: {
        rows: [],
        comment: ''
    },
    freeMediation: {
        option: freeMediation_1.FreeMediationOption.NO
    }
};
exports.sampleResponseDraftObj = Object.assign(Object.assign({}, commonIndividualResponsePartial), commonDefenceResponse);
exports.sampleCompanyResponseDraftObj = Object.assign(Object.assign({}, commonCompanyResponsePartial), commonDefenceResponse);
exports.sampleFullAdmissionResponseDraftObj = Object.assign(Object.assign({}, commonIndividualResponsePartial), { response: {
        type: responseType_1.ResponseType.FULL_ADMISSION
    }, fullAdmission: {
        paymentIntention: {
            paymentOption: {
                option: {
                    value: 'INSTALMENTS'
                }
            },
            paymentPlan: {
                totalAmount: 3685,
                instalmentAmount: 100,
                firstPaymentDate: {
                    year: 2019,
                    month: 1,
                    day: 1
                },
                paymentSchedule: {
                    value: 'EVERY_MONTH',
                    displayValue: 'every month'
                }
            }
        }
    }, statementOfMeans: {
        residence: {
            type: residenceType_1.ResidenceType.OWN_HOME
        },
        employment: { declared: false },
        employers: undefined,
        selfEmployment: undefined,
        unemployment: { option: { value: unemploymentType_1.UnemploymentType.RETIRED.value } },
        dependants: { declared: false },
        otherDependants: { declared: false },
        maintenance: { declared: false },
        bankAccounts: { rows: [] },
        debts: { declared: false },
        monthlyIncome: {
            salary: 1,
            universalCredit: 1,
            jobSeekerAllowanceIncome: 1,
            jobSeekerAllowanceContribution: 1,
            incomeSupport: 1,
            workingTaxCredit: 1,
            childTaxCredit: 1,
            childBenefit: 1,
            councilTaxSupport: 1,
            pension: 1
        },
        monthlyExpenses: {
            mortgage: 1,
            rent: 1,
            councilTax: 1,
            gas: 1,
            electricity: 1,
            water: 1,
            travel: 1,
            schoolCosts: 1,
            foodAndHousekeeping: 1,
            tvAndBroadband: 1,
            phone: 1,
            maintenance: 1,
            rows: [{ amount: 10, description: 'bla bla bla' }]
        },
        courtOrders: { declared: false },
        explanation: { text: 'aaa' }
    } });
exports.sampleFullRejectionDraftObj = Object.assign(Object.assign({}, commonIndividualResponsePartial), { response: {
        type: responseType_1.ResponseType.DEFENCE
    }, rejectAllOfClaim: {
        option: rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID,
        howMuchHaveYouPaid: {
            amount: 200,
            date: {
                year: 2018,
                month: 7,
                day: 27
            },
            text: 'by pigeon'
        },
        whyDoYouDisagree: {
            text: 'bla bla bla'
        }
    } });
exports.samplePartialAdmissionResponseDraftObj = Object.assign(Object.assign({}, commonIndividualResponsePartial), { response: {
        type: responseType_1.ResponseType.PART_ADMISSION
    }, partialAdmission: {
        alreadyPaid: new alreadyPaid_1.AlreadyPaid().deserialize({ alreadyPaid: new alreadyPaid_1.AlreadyPaid(yesNoOption_2.YesNoOption.YES) }),
        howMuchHaveYouPaid: new howMuchHaveYouPaid_1.HowMuchHaveYouPaid().deserialize({ amount: 100, date: '2018-02-01', text: 'by Cash' }),
        paymentIntention: {
            paymentOption: {
                option: {
                    value: 'INSTALMENTS'
                }
            },
            paymentPlan: {
                totalAmount: 3685,
                instalmentAmount: 100,
                firstPaymentDate: {
                    year: 2019,
                    month: 1,
                    day: 1
                },
                paymentSchedule: {
                    value: 'EVERY_MONTH',
                    displayValue: 'every month'
                }
            }
        }
    } });
const sampleCCJDraftObj = {
    defendant: {
        email: { address: 'a@wp.pl' },
        partyDetails: {
            type: 'individual',
            name: 'John Smith',
            address: {
                line1: 'Apartment 99',
                line2: '',
                line3: '',
                city: 'London',
                postcode: 'SE28 0JE'
            },
            dateOfBirth: {
                known: true,
                date: {
                    day: 31,
                    month: 12,
                    year: 1980
                }
            }
        }
    },
    paymentOption: {
        option: {
            value: 'INSTALMENTS',
            displayValue: 'By instalments'
        }
    },
    paidAmount: { option: yesNoOption_1.PaidAmountOption.NO },
    repaymentPlan: {
        remainingAmount: 3685,
        instalmentAmount: 100,
        firstPaymentDate: {
            year: 2019,
            month: 1,
            day: 1
        },
        paymentSchedule: {
            value: 'EVERY_MONTH',
            displayValue: 'every month'
        }
    }
};
exports.sampleClaimantResponseDraftObj = {
    defendantResponseViewed: true,
    settleAdmitted: {
        admitted: {
            option: 'yes'
        }
    },
    acceptPaymentMethod: {
        accept: {
            option: 'yes'
        }
    },
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
    formaliseRepaymentPlan: {
        option: {
            value: 'signSettlementAgreement',
            displayValue: 'Sign a settlement agreement'
        }
    },
    settlementAgreement: {
        signed: true
    },
    freeMediation: {
        option: freeMediation_1.FreeMediationOption.NO
    }
};
exports.sampleMediationDraftObj = {
    willYouTryMediation: {
        option: freeMediation_1.FreeMediationOption.YES
    },
    youCanOnlyUseMediation: {
        option: freeMediation_1.FreeMediationOption.YES
    },
    canWeUse: {
        option: freeMediation_1.FreeMediationOption.NO,
        mediationPhoneNumber: '07777777777'
    },
    canWeUseCompany: {
        option: freeMediation_1.FreeMediationOption.NO,
        mediationPhoneNumber: '07777777777',
        mediationContactPerson: 'Mary Richards'
    }
};
exports.sampleLegacyMediationDraftObj = {
    willYouTryMediation: {
        option: freeMediation_1.FreeMediationOption.NO
    }
};
exports.sampleCompanyMediationDraftObj = {
    willYouTryMediation: {
        option: freeMediation_1.FreeMediationOption.YES
    },
    youCanOnlyUseMediation: {
        option: freeMediation_1.FreeMediationOption.YES
    },
    canWeUseCompany: {
        option: freeMediation_1.FreeMediationOption.NO,
        mediationPhoneNumber: '07777777777',
        mediationContactPerson: 'Mary Richards'
    }
};
exports.sampleDirectionsQuestionnaireDraftObj = {
    selfWitness: {
        option: {
            option: 'yes'
        }
    },
    otherWitnesses: {
        otherWitnesses: {
            option: 'yes'
        },
        howMany: 1
    },
    hearingLocation: {
        courtName: 'Little Whinging, Surrey',
        courtPostCode: undefined,
        courtAccepted: { option: 'yes' },
        alternateCourtName: 'some other court name'
    },
    exceptionalCircumstances: {
        exceptionalCircumstances: { option: 'yes' },
        reason: 'Poorly pet owl'
    },
    availability: {
        hasUnavailableDates: true,
        unavailableDates: [
            { year: 2020, month: 1, day: 4 },
            { year: 2020, month: 2, day: 8 }
        ]
    },
    supportRequired: {
        languageSelected: true,
        languageInterpreted: 'Klingon',
        signLanguageSelected: true,
        signLanguageInterpreted: 'Makaton',
        hearingLoopSelected: true,
        disabledAccessSelected: true,
        otherSupportSelected: true,
        otherSupport: 'Life advice'
    },
    expertRequired: {
        option: {
            option: 'yes'
        }
    },
    expertReports: {
        declared: true,
        rows: [
            {
                expertName: 'Prof. McGonagall',
                reportDate: { year: 2018, month: 1, day: 10 }
            },
            {
                expertName: 'Mr Rubeus Hagrid',
                reportDate: { year: 2019, month: 2, day: 27 }
            }
        ]
    },
    permissionForExpert: {
        option: {
            option: 'yes'
        }
    },
    expertEvidence: {
        expertEvidence: {
            option: 'yes'
        },
        whatToExamine: 'Photographs'
    },
    whyExpertIsNeeded: {
        explanation: 'for expert opinion'
    }
};
exports.sampleOrdersDraftObj = {
    externalId: 'fe6e9413-e804-48d5-bbfd-645917fc46e5',
    disagreeReason: { reason: 'I want a judge to review it' }
};
function resolveFind(draftType, draftOverride) {
    let documentDocument;
    switch (draftType) {
        case 'claim':
            documentDocument = Object.assign(Object.assign({}, exports.sampleClaimDraftObj), draftOverride);
            break;
        case 'claim:ioc':
            documentDocument = Object.assign(Object.assign({}, exports.sampleClaimDraftObjIOC), draftOverride);
            break;
        case 'claim:company':
            documentDocument = Object.assign(Object.assign({}, exports.sampleCompanyClaimDraftObj), draftOverride);
            break;
        case 'response':
            documentDocument = Object.assign(Object.assign({}, exports.sampleResponseDraftObj), draftOverride);
            break;
        case 'response:company':
            documentDocument = Object.assign(Object.assign({}, exports.sampleCompanyResponseDraftObj), draftOverride);
            break;
        case 'response:full-admission':
            documentDocument = Object.assign(Object.assign({}, exports.sampleFullAdmissionResponseDraftObj), draftOverride);
            break;
        case 'response:partial-admission':
            documentDocument = Object.assign(Object.assign({}, exports.samplePartialAdmissionResponseDraftObj), draftOverride);
            break;
        case 'response:full-rejection':
            documentDocument = Object.assign(Object.assign({}, exports.sampleFullRejectionDraftObj), draftOverride);
            break;
        case 'ccj':
            documentDocument = Object.assign(Object.assign({}, sampleCCJDraftObj), draftOverride);
            break;
        case 'claimantResponse':
            documentDocument = Object.assign(Object.assign({}, exports.sampleClaimantResponseDraftObj), draftOverride);
            break;
        case 'mediation':
            documentDocument = Object.assign(Object.assign({}, exports.sampleMediationDraftObj), draftOverride);
            break;
        case 'directionsQuestionnaire':
            documentDocument = Object.assign(Object.assign({}, exports.sampleDirectionsQuestionnaireDraftObj), draftOverride);
            break;
        case 'orders':
            documentDocument = Object.assign(Object.assign({}, exports.sampleOrdersDraftObj), draftOverride);
            break;
        default:
            documentDocument = Object.assign({}, draftOverride);
    }
    return mock(serviceBaseURL)
        .get(new RegExp('/drafts.*'))
        .reply(HttpStatus.OK, {
        data: [{
                id: 100,
                type: draftType.split(':')[0],
                document: documentDocument,
                created: '2017-10-01T12:00:00.000',
                updated: '2017-10-01T12:01:00.000'
            }]
    });
}
exports.resolveFind = resolveFind;
function resolveFindAllDrafts() {
    return mock(serviceBaseURL)
        .get(new RegExp('/drafts.*'))
        .reply(HttpStatus.OK, {
        data: [{
                id: 200,
                type: 'claim',
                document: exports.sampleClaimDraftObj,
                created: '2017-10-01T12:00:00.000',
                updated: '2017-10-01T12:01:00.000'
            }, {
                id: 201,
                type: 'response',
                document: Object.assign(Object.assign({}, exports.sampleResponseDraftObj), exports.sampleFullAdmissionResponseDraftObj),
                created: '2017-10-02T12:00:00.000',
                updated: '2017-10-02T12:01:00.000'
            }, {
                id: 203,
                type: 'ccj',
                document: sampleCCJDraftObj,
                created: '2017-10-03T12:00:00.000',
                updated: '2017-10-03T12:01:00.000'
            }, {
                id: 204,
                type: 'claimantResponse',
                document: exports.sampleClaimantResponseDraftObj,
                created: '2017-10-03T12:00:00.000',
                updated: '2017-10-03T12:01:00.000'
            }, {
                id: 205,
                type: 'paid-in-full',
                document: exports.samplePaidInFullDraftObj,
                created: '2017-10-03T12:00:00.000',
                updated: '2017-10-03T12:01:00.000'
            }]
    });
}
exports.resolveFindAllDrafts = resolveFindAllDrafts;
function resolveFindNoDraftFound() {
    return mock(serviceBaseURL)
        .get(new RegExp('/drafts.*'))
        .reply(HttpStatus.OK, {
        data: []
    });
}
exports.resolveFindNoDraftFound = resolveFindNoDraftFound;
function rejectFind(reason = 'HTTP error') {
    return mock(serviceBaseURL)
        .get(new RegExp('/drafts.*'))
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectFind = rejectFind;
function resolveUpdate(id = 100) {
    return mock(serviceBaseURL)
        .put(`/drafts/${id}`)
        .reply(HttpStatus.OK);
}
exports.resolveUpdate = resolveUpdate;
function resolveSave(id = 100) {
    return mock(serviceBaseURL)
        .post(`/drafts`)
        .reply(HttpStatus.OK, exports.sampleOrdersDraftObj);
}
exports.resolveSave = resolveSave;
function rejectSave(id = 100, reason = 'HTTP error') {
    return mock(serviceBaseURL)
        .post(`/drafts`)
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectSave = rejectSave;
function rejectUpdate(id = 100, reason = 'HTTP error') {
    return mock(serviceBaseURL)
        .put(`/drafts/${id}`)
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectUpdate = rejectUpdate;
function resolveDelete(id = 100) {
    return mock(serviceBaseURL)
        .delete(`/drafts/${id}`)
        .reply(HttpStatus.OK);
}
exports.resolveDelete = resolveDelete;
function rejectDelete(id = 100, reason = 'HTTP error') {
    return mock(serviceBaseURL)
        .delete(`/drafts/${id}`)
        .reply(HttpStatus.INTERNAL_SERVER_ERROR, reason);
}
exports.rejectDelete = rejectDelete;
