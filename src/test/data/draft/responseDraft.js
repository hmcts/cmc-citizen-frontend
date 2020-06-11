"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paymentSchedule_1 = require("claims/models/response/core/paymentSchedule");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const responseType_1 = require("response/form/models/responseType");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const partyDetails_1 = require("test/data/draft/partyDetails");
const yesNoOption_1 = require("models/yesNoOption");
const defendantTimeline_1 = require("response/form/models/defendantTimeline");
const defendantEvidence_1 = require("response/form/models/defendantEvidence");
const whyDoYouDisagree_1 = require("response/form/models/whyDoYouDisagree");
const disability_1 = require("response/form/models/statement-of-means/disability");
const cohabiting_1 = require("response/form/models/statement-of-means/cohabiting");
const carer_1 = require("response/form/models/statement-of-means/carer");
const baseResponseDraft = {
    defendantDetails: {
        partyDetails: partyDetails_1.individualDetails,
        phone: {
            number: '0700000000'
        },
        email: {
            address: 'user@example.com'
        }
    },
    moreTimeNeeded: {
        option: 'no'
    }
};
const baseDefenceDraft = {
    response: {
        type: {
            value: responseType_1.ResponseType.DEFENCE.value
        }
    },
    defence: {
        text: 'My defence'
    },
    freeMediation: {
        option: 'no'
    }
};
exports.partiallyAdmittedDefenceWithWhyDoYouDisagreeCompleted = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), baseDefenceDraft), { partialAdmission: { whyDoYouDisagree: new whyDoYouDisagree_1.WhyDoYouDisagree('I am not sure') }, timeline: new defendantTimeline_1.DefendantTimeline(), evidence: new defendantEvidence_1.DefendantEvidence() });
exports.defenceWithDisputeDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), baseDefenceDraft), { rejectAllOfClaim: {
        option: rejectAllOfClaim_1.RejectAllOfClaimOption.DISPUTE
    } });
exports.defenceWithAmountClaimedAlreadyPaidDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), baseDefenceDraft), { rejectAllOfClaim: {
        option: rejectAllOfClaim_1.RejectAllOfClaimOption.ALREADY_PAID,
        howMuchHaveYouPaid: {
            amount: 100,
            date: {
                year: 2017,
                month: 12,
                day: 31
            },
            text: 'I paid in cash'
        },
        whyDoYouDisagree: {
            text: 'bla bla bla'
        }
    } });
const baseFullAdmissionDraft = {
    response: {
        type: {
            value: responseType_1.ResponseType.FULL_ADMISSION.value
        }
    }
};
const basePartialAdmissionDraft = {
    response: {
        type: {
            value: responseType_1.ResponseType.PART_ADMISSION.value
        }
    }
};
exports.fullAdmissionWithImmediatePaymentDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), baseFullAdmissionDraft), { fullAdmission: {
        paymentIntention: {
            paymentOption: {
                option: paymentOption_1.PaymentType.IMMEDIATELY
            }
        }
    } });
exports.basePartialFuturePaymentDetails = {
    alreadyPaid: {
        option: yesNoOption_1.YesNoOption.YES
    },
    howMuchHaveYouPaid: {
        amount: 3000
    },
    whyDoYouDisagree: {
        text: 'i have paid more than enough'
    }
};
exports.basePartialAlreadyPaidDetails = {
    alreadyPaid: {
        option: yesNoOption_1.YesNoOption.YES
    },
    howMuchHaveYouPaid: {
        amount: 3000,
        date: {
            year: 2050,
            month: 12,
            day: 31
        },
        text: 'i have already paid enough'
    },
    whyDoYouDisagree: {
        text: 'i have paid more than enough'
    }
};
exports.partialTimelineAndEvidences = {
    timeline: {
        rows: [
            {
                date: '1 May 2017',
                description: ' you might have signed a contract'
            }
        ],
        comment: ' you might have signed a contract'
    },
    evidence: {
        rows: [
            {
                type: {
                    value: 'CONTRACTS_AND_AGREEMENTS',
                    displayValue: 'Contracts and agreements'
                },
                description: ' you might have signed a contract'
            }
        ],
        comment: ' you might have signed a contract'
    }
};
exports.partialAdmissionWithImmediatePaymentDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), basePartialAdmissionDraft), { partialAdmission: Object.assign(Object.assign(Object.assign({}, exports.basePartialFuturePaymentDetails), { paymentIntention: {
            paymentOption: {
                option: paymentOption_1.PaymentType.IMMEDIATELY
            }
        } }), exports.partialTimelineAndEvidences) });
exports.partialAdmissionAlreadyPaidDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), basePartialAdmissionDraft), { partialAdmission: Object.assign(Object.assign({}, exports.basePartialAlreadyPaidDetails), exports.partialTimelineAndEvidences) });
exports.fullAdmissionWithPaymentBySetDateDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), baseFullAdmissionDraft), { fullAdmission: {
        paymentIntention: {
            paymentOption: {
                option: paymentOption_1.PaymentType.BY_SET_DATE
            },
            paymentDate: {
                date: {
                    year: 2050,
                    month: 12,
                    day: 31
                }
            }
        }
    } });
exports.partialAdmissionWithPaymentBySetDateDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), basePartialAdmissionDraft), { partialAdmission: Object.assign(Object.assign(Object.assign({}, exports.basePartialFuturePaymentDetails), { paymentIntention: {
            paymentOption: {
                option: paymentOption_1.PaymentType.BY_SET_DATE
            },
            paymentDate: {
                date: {
                    year: 2050,
                    month: 12,
                    day: 31
                }
            }
        } }), exports.partialTimelineAndEvidences) });
exports.fullAdmissionWithPaymentByInstalmentsDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), baseFullAdmissionDraft), { fullAdmission: {
        paymentIntention: {
            paymentOption: {
                option: paymentOption_1.PaymentType.INSTALMENTS
            },
            paymentPlan: {
                instalmentAmount: 100,
                firstPaymentDate: {
                    year: 2050,
                    month: 12,
                    day: 31
                },
                paymentSchedule: {
                    value: paymentSchedule_1.PaymentSchedule.EACH_WEEK
                },
                completionDate: {
                    year: 2051,
                    month: 12,
                    day: 31
                },
                paymentLength: '1'
            }
        }
    } });
exports.partialAdmissionWithPaymentByInstalmentsDraft = Object.assign(Object.assign(Object.assign({}, baseResponseDraft), basePartialAdmissionDraft), { partialAdmission: Object.assign(Object.assign(Object.assign({}, exports.basePartialFuturePaymentDetails), { paymentIntention: {
            paymentOption: {
                option: paymentOption_1.PaymentType.INSTALMENTS
            },
            paymentPlan: {
                instalmentAmount: 100,
                firstPaymentDate: {
                    year: 2050,
                    month: 12,
                    day: 31
                },
                paymentSchedule: {
                    value: paymentSchedule_1.PaymentSchedule.EACH_WEEK
                },
                completionDate: {
                    year: 2051,
                    month: 12,
                    day: 31
                },
                paymentLength: '1'
            }
        } }), exports.partialTimelineAndEvidences) });
exports.statementOfMeansWithMandatoryFieldsDraft = {
    bankAccounts: {
        rows: [{
                typeOfAccount: bankAccountType_1.BankAccountType.CURRENT_ACCOUNT,
                joint: false,
                balance: 1000
            }]
    },
    disability: disability_1.DisabilityOption.NO,
    residence: {
        type: residenceType_1.ResidenceType.OWN_HOME
    },
    cohabiting: cohabiting_1.CohabitingOption.NO,
    dependants: {
        declared: false
    },
    maintenance: {
        declared: false
    },
    otherDependants: {
        declared: false
    },
    carer: carer_1.CarerOption.NO,
    employment: {
        declared: false
    },
    unemployment: {
        option: unemploymentType_1.UnemploymentType.RETIRED
    },
    debts: {
        declared: false
    },
    courtOrders: {
        declared: false
    },
    explanation: 'Some reason',
    monthlyIncome: {
        childBenefitSource: {
            name: 'Child Benefit',
            amount: 200,
            schedule: {
                value: 'WEEK',
                displayValue: 'Week'
            }
        }
    },
    monthlyExpenses: {
        mortgage: {
            name: 'mortgage',
            amount: 100,
            schedule: {
                value: 'MONTH',
                displayValue: 'Month'
            }
        }
    }
};
exports.statementOfMeansWithAllFieldsDraft = Object.assign(Object.assign({}, exports.statementOfMeansWithMandatoryFieldsDraft), { disability: true, severeDisability: true, cohabiting: true, partnerAge: true, partnerPension: true, partnerDisability: true, partnerSevereDisability: true, dependants: {
        declared: true,
        numberOfChildren: {
            under11: 1,
            between11and15: 2,
            between16and19: 3
        }
    }, education: {
        value: 3
    }, dependantsDisability: true, otherDependants: {
        declared: true,
        numberOfPeople: {
            value: 5,
            details: 'Colleagues'
        }
    }, otherDependantsDisability: true, carer: new carer_1.Carer(carer_1.CarerOption.YES), employment: {
        declared: true,
        employed: true,
        selfEmployed: true
    }, employers: {
        rows: [{
                employerName: 'HMCTS',
                jobTitle: 'Service manager'
            }]
    }, selfEmployment: {
        jobTitle: 'Director',
        annualTurnover: 100000
    }, onTaxPayments: {
        declared: true,
        amountYouOwe: 100,
        reason: 'Various taxes'
    }, unemployment: undefined, debts: {
        declared: true,
        rows: [{
                debt: 'Hard to tell',
                totalOwed: 1000,
                monthlyPayments: 100
            }]
    }, courtOrders: {
        declared: true,
        rows: [{
                claimNumber: '000MC001',
                amount: 100,
                instalmentAmount: 10
            }]
    } });
