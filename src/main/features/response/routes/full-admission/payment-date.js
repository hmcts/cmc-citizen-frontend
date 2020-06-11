"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_date_1 = require("shared/components/payment-intention/payment-date");
const model_accessor_1 = require("shared/components/model-accessor");
const optInFeatureToggleGuard_1 = require("guards/optInFeatureToggleGuard");
const paths_1 = require("response/paths");
class ModelAccessor extends model_accessor_1.AbstractModelAccessor {
    get(draft) {
        return draft.fullAdmission.paymentIntention;
    }
    set(draft, model) {
        draft.fullAdmission.paymentIntention = model;
    }
}
class PaymentDatePage extends payment_date_1.AbstractPaymentDatePage {
    getHeading() {
        return 'What date will you pay on?';
    }
    createModelAccessor() {
        return new ModelAccessor();
    }
    buildPostSubmissionUri(req, res) {
        const { externalId } = req.params;
        return paths_1.Paths.taskListPage.evaluateUri({ externalId: externalId });
    }
}
/* tslint:disable:no-default-export */
exports.default = new PaymentDatePage()
    .buildRouter(paths_1.fullAdmissionPath, optInFeatureToggleGuard_1.OptInFeatureToggleGuard.featureEnabledGuard('admissions'));
