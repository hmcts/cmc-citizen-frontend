"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const paths_1 = require("eligibility/paths");
const jwtExtractor_1 = require("idam/jwtExtractor");
const idamClient_1 = require("idam/idamClient");
const authorizationMiddleware_1 = require("idam/authorizationMiddleware");
const claimType_1 = require("eligibility/model/claimType");
const claimValue_1 = require("eligibility/model/claimValue");
const defendantAgeOption_1 = require("eligibility/model/defendantAgeOption");
const routerFinder_1 = require("shared/router/routerFinder");
async function authorizationRequestHandler(req, res, next) {
    const jwt = jwtExtractor_1.JwtExtractor.extract(req);
    if (jwt) {
        try {
            await idamClient_1.IdamClient.retrieveUserFor(jwt);
            res.locals.isLoggedIn = true;
        }
        catch (err) {
            if (!authorizationMiddleware_1.hasTokenExpired(err)) {
                next(err);
                return;
            }
        }
    }
    next();
}
class Feature {
    enableFor(app) {
        if (app.settings.nunjucksEnv && app.settings.nunjucksEnv.globals) {
            app.settings.nunjucksEnv.globals.EligibilityPaths = paths_1.Paths;
            app.settings.nunjucksEnv.globals.ClaimType = claimType_1.ClaimType;
            app.settings.nunjucksEnv.globals.ClaimValue = claimValue_1.ClaimValue;
            app.settings.nunjucksEnv.globals.DefendantAgeOption = defendantAgeOption_1.DefendantAgeOption;
        }
        app.use('/eligibility*', authorizationRequestHandler);
        app.use('/', routerFinder_1.RouterFinder.findAll(path.join(__dirname, 'routes')));
    }
}
exports.Feature = Feature;
