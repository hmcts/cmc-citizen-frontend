"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_option_1 = require("shared/components/payment-intention/payment-option");
const model_accessor_1 = require("shared/components/model-accessor");
const paymentIntention_1 = require("shared/components/payment-intention/model/paymentIntention");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const paymentOption_1 = require("shared/components/payment-intention/model/paymentOption");
const paths_1 = require("response/paths");
class ModelAccessor extends model_accessor_1.AbstractModelAccessor {
    get(draft) {
        return draft.partialAdmission.paymentIntention ? draft.partialAdmission.paymentIntention : new paymentIntention_1.PaymentIntention();
    }
    set(draft, model) {
        draft.partialAdmission.paymentIntention = model;
    }
}
class PaymentOptionPage extends payment_option_1.AbstractPaymentOptionPage {
    createModelAccessor() {
        return new ModelAccessor();
    }
    buildPostSubmissionUri(path, req, res) {
        const model = req.body.model;
        if (model.isOfType(paymentOption_1.PaymentType.INSTALMENTS)) {
            return this.buildTaskListUri(req, res);
        }
        return super.buildPostSubmissionUri(path, req, res);
    }
    buildTaskListUri(req, res) {
        const { externalId } = req.params;
        return paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
    }
}
const setHowMuchDoYouOweAmount = (req, res, next) => {
    const draft = res.locals.responseDraft.document;
    if (draft.isResponsePartiallyAdmitted() && draft.partialAdmission.howMuchDoYouOwe) {
        res.locals.amount = draft.partialAdmission.howMuchDoYouOwe.amount || 0;
    }
    next();
};
/* tslint:disable:no-default-export */
exports.default = new PaymentOptionPage()
    .buildRouter(paths_1.partialAdmissionPath, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'), setHowMuchDoYouOweAmount);
