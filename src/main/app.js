"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const express = require("express");
const config = require("config");
const path = require("path");
const favicon = require("serve-favicon");
const cookieParser = require("cookie-parser");
const cookieEncrypter = require("@hmcts/cookie-encrypter");
const bodyParser = require("body-parser");
const errors_1 = require("errors");
const errorLogger_1 = require("logging/errorLogger");
const routerFinder_1 = require("shared/router/routerFinder");
const helmet_1 = require("modules/helmet");
const i18n_1 = require("modules/i18n");
const nunjucks_1 = require("modules/nunjucks");
const moment = require("moment");
const index_1 = require("eligibility/index");
const index_2 = require("claim/index");
const index_3 = require("first-contact/index");
const index_4 = require("response/index");
const index_5 = require("settlement-agreement/index");
const csrf_1 = require("modules/csrf");
const index_6 = require("dashboard/index");
const index_7 = require("ccj/index");
const index_8 = require("offer/index");
const index_9 = require("testing-support/index");
const featureToggles_1 = require("utils/featureToggles");
const index_10 = require("claimant-response/index");
const index_11 = require("paid-in-full/index");
const index_12 = require("mediation/index");
const directions_questionnaire_1 = require("features/directions-questionnaire");
const index_13 = require("orders/index");
const customEventTracker_1 = require("logging/customEventTracker");
exports.app = express();
const env = process.env.NODE_ENV || 'development';
exports.app.locals.ENV = env;
const developmentMode = env === 'development';
const logger = nodejs_logging_1.Logger.getLogger('applicationRunner');
const i18next = i18n_1.I18Next.enableFor(exports.app);
new nunjucks_1.Nunjucks(developmentMode, i18next)
    .enableFor(exports.app);
new helmet_1.Helmet(config.get('security'), developmentMode)
    .enableFor(exports.app);
exports.app.enable('trust proxy');
exports.app.use(favicon(path.join(__dirname, '/public/img/lib/favicon.ico')));
exports.app.use(bodyParser.json());
exports.app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));
exports.app.use(cookieParser());
exports.app.use(cookieEncrypter(config.get('secrets.cmc.encryptionKey'), {
    options: {
        algorithm: 'aes128'
    }
}));
// Web Chat
exports.app.use('/webchat', express.static(path.join(__dirname, '/public/webchat')));
exports.app.use(express.static(path.join(__dirname, 'public')));
if (env !== 'mocha') {
    new csrf_1.CsrfProtection().enableFor(exports.app);
}
new index_1.Feature().enableFor(exports.app);
new index_6.DashboardFeature().enableFor(exports.app);
new index_2.Feature().enableFor(exports.app);
new index_3.Feature().enableFor(exports.app);
new index_4.Feature().enableFor(exports.app);
new index_7.CCJFeature().enableFor(exports.app);
new index_8.Feature().enableFor(exports.app);
new index_5.Feature().enableFor(exports.app);
new index_12.MediationFeature().enableFor(exports.app);
new index_11.PaidInFullFeature().enableFor(exports.app);
if (featureToggles_1.FeatureToggles.isEnabled('testingSupport')) {
    logger.info('FeatureToggles.testingSupport enabled');
    new index_9.TestingSupportFeature().enableFor(exports.app);
}
if (featureToggles_1.FeatureToggles.isEnabled('admissions')) {
    logger.info('FeatureToggles.admissions enabled');
    new index_10.ClaimantResponseFeature().enableFor(exports.app);
}
if (featureToggles_1.FeatureToggles.isEnabled('directionsQuestionnaire')) {
    logger.info('FeatureToggles.directionsQuestionnaire enabled');
    new directions_questionnaire_1.DirectionsQuestionnaireFeature().enableFor(exports.app);
    new index_13.OrdersFeature().enableFor(exports.app);
}
// Below method overrides the moment's toISOString method, which is used by RequestPromise
// to convert moment object to String
moment.prototype.toISOString = function () {
    return this.format('YYYY-MM-DD[T]HH:mm:ss.SSS');
};
exports.app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
// Below will match all routes not covered by the router, which effectively translates to a 404 response
exports.app.use((req, res, next) => {
    next(new errors_1.NotFoundError(req.path));
});
// error handlers
const errorLogger = new errorLogger_1.ErrorLogger();
// exported for testability
exports.errorHandler = (err, req, res, next) => {
    errorLogger.log(err);
    res.status(err.statusCode || 500);
    if (err.statusCode === 302 && err.associatedView) {
        res.redirect(err.associatedView);
    }
    else if (err.associatedView) {
        res.render(err.associatedView);
    }
    else if (err.statusCode === 403) {
        res.render(new errors_1.ForbiddenError().associatedView);
    }
    else {
        const view = featureToggles_1.FeatureToggles.isEnabled('returnErrorToUser') ? 'error_dev' : 'error';
        if (err.name === 'Template render error') {
            customEventTracker_1.trackCustomEvent('CMC Dashboard Failure', { error: err });
        }
        res.render(view, {
            error: err,
            title: 'error'
        });
    }
    next();
};
exports.app.use(exports.errorHandler);
