"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dateUtils_1 = require("shared/dateUtils");
const path = require("path");
const config = require("config");
const nunjucks = require("nunjucks");
const dateFilter_1 = require("modules/nunjucks/filters/dateFilter");
const convertToPounds_1 = require("modules/nunjucks/filters/convertToPounds");
const numeralFilter = require("nunjucks-numeral-filter");
const numeral = require("numeral");
const moment = require("moment");
const toBoolean = require("to-boolean");
const numberFormatter_1 = require("utils/numberFormatter");
const rejectAllOfClaim_1 = require("response/form/models/rejectAllOfClaim");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const signatureType_1 = require("common/signatureType");
const responseType_1 = require("response/form/models/responseType");
const yesNoOption_1 = require("models/yesNoOption");
const notEligibleReason_1 = require("eligibility/notEligibleReason");
const evidenceType_1 = require("forms/models/evidenceType");
const statementType_1 = require("offer/form/models/statementType");
const interestDateType_1 = require("common/interestDateType");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
const paymentSchedule_1 = require("ccj/form/models/paymentSchedule");
const unemploymentType_1 = require("response/form/models/statement-of-means/unemploymentType");
const bankAccountType_1 = require("response/form/models/statement-of-means/bankAccountType");
const claimStatus_1 = require("claims/models/claimStatus");
const countyCourtJudgmentType_1 = require("claims/models/countyCourtJudgmentType");
const paths_1 = require("paths");
const paths_2 = require("features/dashboard/paths");
const paths_3 = require("features/ccj/paths");
const paths_4 = require("features/paid-in-full/paths");
const paths_5 = require("features/claimant-response/paths");
const paths_6 = require("settlement-agreement/paths");
const paths_7 = require("mediation/paths");
const paths_8 = require("features/directions-questionnaire/paths");
const paths_9 = require("features/orders/paths");
const paths_10 = require("testing-support/paths");
const paths_11 = require("features/claim/paths");
const paths_12 = require("features/response/paths");
const howMuchPaidClaimant_1 = require("response/form/models/howMuchPaidClaimant");
const ccjPaymentOption_1 = require("ccj/form/models/ccjPaymentOption");
const interestType_1 = require("claim/form/models/interestType");
const mediationOutcome_1 = require("claims/models/mediationOutcome");
const interestEndDate_1 = require("claim/form/models/interestEndDate");
const service_1 = require("models/service");
const interestRateOption_1 = require("claim/form/models/interestRateOption");
const interestType_2 = require("claims/models/interestType");
const alreadyPaid_1 = require("response/form/models/alreadyPaid");
const monthlyIncomeType_1 = require("response/form/models/statement-of-means/monthlyIncomeType");
const monthlyExpenseType_1 = require("response/form/models/statement-of-means/monthlyExpenseType");
const claimantResponseType_1 = require("claims/models/claimant-response/claimantResponseType");
const formaliseOption_1 = require("claims/models/claimant-response/formaliseOption");
const priorityDebtType_1 = require("response/form/models/statement-of-means/priorityDebtType");
const disability_1 = require("response/form/models/statement-of-means/disability");
const yesNoFilter_1 = require("modules/nunjucks/filters/yesNoFilter");
const decisionType_1 = require("common/court-calculations/decisionType");
const madeBy_1 = require("claims/models/madeBy");
const partyType_1 = require("common/partyType");
const incomeExpenseSchedule_1 = require("common/calculate-monthly-income-expense/incomeExpenseSchedule");
const freeMediation_1 = require("main/app/forms/models/freeMediation");
const paymentOption_2 = require("claims/models/paymentOption");
const responseType_2 = require("claims/models/response/responseType");
const featuresBuilder_1 = require("claim/helpers/featuresBuilder");
const packageDotJson = require('../../../../package.json');
const appAssetPaths = {
    js: '/js',
    js_vendor: '/js/lib',
    webchat: '/webchat',
    style: '/stylesheets',
    style_vendor: '/stylesheets/lib',
    images: '/img',
    images_vendor: '/img/lib',
    pdf: '/pdf'
};
class Nunjucks {
    constructor(developmentMode, i18next) {
        this.developmentMode = developmentMode;
        this.i18next = i18next;
        this.developmentMode = developmentMode;
        this.i18next = i18next;
    }
    enableFor(app) {
        app.set('view engine', 'njk');
        const nunjucksEnv = nunjucks.configure([
            path.join(__dirname, '..', '..', 'views'),
            path.join(__dirname, '..', '..', 'common'),
            path.join(__dirname, '..', '..', 'features'),
            path.join(__dirname, '..', '..', 'views', 'macro'),
            path.join(__dirname, '..', '..', '..', '..', 'node_modules', '@hmcts', 'cmc-common-frontend', 'macros')
        ], {
            autoescape: true,
            throwOnUndefined: true,
            watch: this.developmentMode,
            express: app
        });
        app.use((req, res, next) => {
            res.locals.pagePath = req.path;
            next();
        });
        require('numeral/locales/en-gb');
        numeral.locale('en-gb');
        numeral.defaultFormat(numberFormatter_1.NUMBER_FORMAT);
        moment.locale('en-gb');
        nunjucksEnv.addGlobal('asset_paths', appAssetPaths);
        nunjucksEnv.addGlobal('serviceName', 'Money Claims');
        nunjucksEnv.addGlobal('supportEmailAddress', config.get('secrets.cmc.staff-email'));
        nunjucksEnv.addGlobal('development', this.developmentMode);
        nunjucksEnv.addGlobal('govuk_template_version', packageDotJson.dependencies.govuk_template_jinja);
        nunjucksEnv.addGlobal('gaTrackingId', config.get('analytics.gaTrackingId'));
        nunjucksEnv.addGlobal('t', (key, options) => this.i18next.t(key, options));
        nunjucksEnv.addFilter('date', dateFilter_1.dateFilter);
        nunjucksEnv.addFilter('inputDate', dateFilter_1.dateInputFilter);
        nunjucksEnv.addFilter('dateWithDayAtFront', dateFilter_1.dateWithDayAtFrontFilter);
        nunjucksEnv.addFilter('addDays', dateFilter_1.addDaysFilter);
        nunjucksEnv.addFilter('pennies2pounds', convertToPounds_1.convertToPoundsFilter);
        nunjucksEnv.addFilter('monthIncrement', dateFilter_1.monthIncrementFilter);
        nunjucksEnv.addFilter('numeral', numeralFilter);
        nunjucksEnv.addFilter('yesNo', yesNoFilter_1.yesNoFilter);
        nunjucksEnv.addGlobal('isAfter4pm', dateUtils_1.isAfter4pm);
        nunjucksEnv.addGlobal('betaFeedbackSurveyUrl', config.get('feedback.feedbackSurvey.url'));
        nunjucksEnv.addGlobal('reportProblemSurveyUrl', config.get('feedback.reportProblemSurvey.url'));
        nunjucksEnv.addGlobal('customerSurveyUrl', config.get('feedback.serviceSurvey.url'));
        nunjucksEnv.addGlobal('featureToggles', this.convertPropertiesToBoolean(config.get('featureToggles')));
        nunjucksEnv.addGlobal('RejectAllOfClaimOption', rejectAllOfClaim_1.RejectAllOfClaimOption);
        nunjucksEnv.addGlobal('AlreadyPaid', alreadyPaid_1.AlreadyPaid);
        nunjucksEnv.addGlobal('DefendantPaymentType', paymentOption_1.PaymentType);
        nunjucksEnv.addGlobal('DefendantPaymentOption', paymentOption_1.PaymentOption);
        nunjucksEnv.addGlobal('PaymentType', ccjPaymentOption_1.PaymentType);
        nunjucksEnv.addGlobal('InterestRateOption', interestRateOption_1.InterestRateOption);
        nunjucksEnv.addGlobal('SignatureType', signatureType_1.SignatureType);
        nunjucksEnv.addGlobal('ResponseType', responseType_1.ResponseType);
        nunjucksEnv.addGlobal('MadeBy', madeBy_1.MadeBy);
        nunjucksEnv.addGlobal('CountyCourtJudgmentType', countyCourtJudgmentType_1.CountyCourtJudgmentType);
        nunjucksEnv.addGlobal('YesNoOption', yesNoOption_1.YesNoOption);
        nunjucksEnv.addGlobal('EvidenceType', evidenceType_1.EvidenceType);
        nunjucksEnv.addGlobal('StatementType', statementType_1.StatementType);
        nunjucksEnv.addGlobal('NotEligibleReason', notEligibleReason_1.NotEligibleReason);
        nunjucksEnv.addGlobal('InterestType', interestType_2.InterestType);
        nunjucksEnv.addGlobal('InterestTypeOption', interestType_1.InterestTypeOption);
        nunjucksEnv.addGlobal('MediationOutcome', mediationOutcome_1.MediationOutcome);
        nunjucksEnv.addGlobal('InterestDateType', interestDateType_1.InterestDateType);
        nunjucksEnv.addGlobal('InterestEndDateOption', interestEndDate_1.InterestEndDateOption);
        nunjucksEnv.addGlobal('FormaliseOption', formaliseOption_1.FormaliseOption);
        nunjucksEnv.addGlobal('ClaimantResponseType', claimantResponseType_1.ClaimantResponseType);
        nunjucksEnv.addGlobal('ResidenceType', residenceType_1.ResidenceType);
        nunjucksEnv.addGlobal('PaymentSchedule', paymentSchedule_1.PaymentSchedule);
        nunjucksEnv.addGlobal('UnemploymentType', unemploymentType_1.UnemploymentType);
        nunjucksEnv.addGlobal('BankAccountType', bankAccountType_1.BankAccountType);
        nunjucksEnv.addGlobal('ClaimStatus', claimStatus_1.ClaimStatus);
        nunjucksEnv.addGlobal('AppPaths', paths_1.Paths);
        nunjucksEnv.addGlobal('ClaimPaths', paths_11.Paths);
        nunjucksEnv.addGlobal('ClaimantResponsePaths', paths_5.Paths);
        nunjucksEnv.addGlobal('DashboardPaths', paths_2.Paths);
        nunjucksEnv.addGlobal('CCJPaths', paths_3.Paths);
        nunjucksEnv.addGlobal('StatePaidPaths', paths_4.Paths);
        nunjucksEnv.addGlobal('ResponsePaths', paths_12.Paths);
        nunjucksEnv.addGlobal('MediationPaths', paths_7.Paths);
        nunjucksEnv.addGlobal('PartAdmissionPaths', paths_12.PartAdmissionPaths);
        nunjucksEnv.addGlobal('FullRejectionPaths', paths_12.FullRejectionPaths);
        nunjucksEnv.addGlobal('DirectionsQuestionnairePaths', paths_8.Paths);
        nunjucksEnv.addGlobal('OrdersPaths', paths_9.Paths);
        nunjucksEnv.addGlobal('TestingSupportPaths', paths_10.Paths);
        nunjucksEnv.addGlobal('SettlementAgreementPaths', paths_6.Paths);
        nunjucksEnv.addGlobal('HowMuchPaidClaimantOption', howMuchPaidClaimant_1.HowMuchPaidClaimantOption);
        nunjucksEnv.addGlobal('MonthlyIncomeType', monthlyIncomeType_1.MonthlyIncomeType);
        nunjucksEnv.addGlobal('MonthlyExpenseType', monthlyExpenseType_1.MonthlyExpenseType);
        nunjucksEnv.addGlobal('PriorityDebtType', priorityDebtType_1.PriorityDebtType);
        nunjucksEnv.addGlobal('Service', service_1.Service);
        nunjucksEnv.addGlobal('DisabilityStatus', disability_1.Disability);
        nunjucksEnv.addGlobal('cookieText', `GOV.UK uses cookies make the site simpler. <a href="${paths_1.Paths.cookiesPage.uri}">Find out more about cookies</a>`);
        nunjucksEnv.addGlobal('serviceName', `Money Claims`);
        nunjucksEnv.addGlobal('headingVisible', true);
        nunjucksEnv.addGlobal('DecisionType', decisionType_1.DecisionType);
        nunjucksEnv.addGlobal('PartyType', partyType_1.PartyType);
        nunjucksEnv.addGlobal('IncomeExpenseSchedule', incomeExpenseSchedule_1.IncomeExpenseSchedule);
        nunjucksEnv.addGlobal('FreeMediationOption', freeMediation_1.FreeMediationOption);
        nunjucksEnv.addGlobal('SignatureType', signatureType_1.SignatureType);
        nunjucksEnv.addGlobal('domain', {
            ResponseType: responseType_2.ResponseType,
            PaymentOption: paymentOption_2.PaymentOption,
            PaymentSchedule: paymentSchedule_1.PaymentSchedule
        });
        nunjucksEnv.addGlobal('PaymentOption', paymentOption_2.PaymentOption);
        nunjucksEnv.addGlobal('SignatureType', signatureType_1.SignatureType);
        nunjucksEnv.addGlobal('FeaturesBuilder', featuresBuilder_1.FeaturesBuilder);
        nunjucksEnv.addGlobal('toDate', function (date) {
            return date ? new Date(date) : new Date();
        });
    }
    convertPropertiesToBoolean(featureToggles) {
        if (!featureToggles) {
            throw new Error('Feature toggles are not defined');
        }
        return Object.keys(featureToggles).reduce((result, property) => {
            result[property] = toBoolean(Object.getOwnPropertyDescriptor(featureToggles, property).value);
            return result;
        }, {});
    }
}
exports.Nunjucks = Nunjucks;
