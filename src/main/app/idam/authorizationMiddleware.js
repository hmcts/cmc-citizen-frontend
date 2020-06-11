"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const HttpStatus = require("http-status-codes");
const Cookies = require("cookies");
const jwtExtractor_1 = require("idam/jwtExtractor");
const idamClient_1 = require("idam/idamClient");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
const sessionCookieName = config.get('session.cookieName');
const logger = nodejs_logging_1.Logger.getLogger('middleware/authorization');
/**
 * IDAM doesn't tell us what is wrong
 * But most likely if we get 401 or 403 then the user's token has expired
 * So make them login again
 */
function hasTokenExpired(err) {
    return (err.statusCode === HttpStatus.FORBIDDEN || err.statusCode === HttpStatus.UNAUTHORIZED);
}
exports.hasTokenExpired = hasTokenExpired;
class AuthorizationMiddleware {
    static requestHandler(requiredRoles, accessDeniedCallback, unprotectedPaths) {
        function isPathUnprotected(path) {
            return unprotectedPaths.some((unprotectedPath) => unprotectedPath === path);
        }
        return (req, res, next) => {
            const jwt = jwtExtractor_1.JwtExtractor.extract(req);
            if (isPathUnprotected(req.path)) {
                logger.debug(`Unprotected path - access to ${req.path} granted`);
                return next();
            }
            if (!jwt) {
                logger.debug(`Protected path - no JWT - access to ${req.path} rejected`);
                return accessDeniedCallback(req, res);
            }
            else {
                idamClient_1.IdamClient
                    .retrieveUserFor(jwt)
                    .then((user) => {
                    if (!user.isInRoles(...requiredRoles)) {
                        logger.error(`Protected path - valid JWT but user not in ${requiredRoles} roles - redirecting to access denied page`);
                        return accessDeniedCallback(req, res);
                    }
                    else {
                        res.locals.isLoggedIn = true;
                        res.locals.user = user;
                        logger.debug(`Protected path - valid JWT & role - access to ${req.path} granted`);
                        return next();
                    }
                })
                    .catch((err) => {
                    if (hasTokenExpired(err)) {
                        const cookies = new Cookies(req, res);
                        cookies.set(sessionCookieName, '');
                        logger.debug(`Protected path - invalid JWT - access to ${req.path} rejected`);
                        return accessDeniedCallback(req, res);
                    }
                    return next(err);
                });
            }
        };
    }
}
exports.AuthorizationMiddleware = AuthorizationMiddleware;
