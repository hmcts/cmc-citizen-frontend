"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const uuid = require("uuid");
const Cookies = require("cookies");
const callbackBuilder_1 = require("utils/callbackBuilder");
const paths_1 = require("paths");
const clientId = config.get('oauth.clientId');
const loginPath = `${config.get('idam.authentication-web.url')}/login`;
class OAuthHelper {
    static forLogin(req, res, receiver = paths_1.Paths.receiver) {
        const redirectUri = callbackBuilder_1.buildURL(req, receiver.uri);
        const state = uuid();
        OAuthHelper.storeStateCookie(req, res, state);
        return `${loginPath}?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`;
    }
    static forPin(req, res, claimReference) {
        const redirectUri = callbackBuilder_1.buildURL(req, paths_1.Paths.receiver.uri);
        const state = claimReference;
        OAuthHelper.storeStateCookie(req, res, state);
        return `${loginPath}/pin?response_type=code&state=${state}&client_id=${clientId}&redirect_uri=${redirectUri}`;
    }
    static forUplift(req, res) {
        const redirectUri = callbackBuilder_1.buildURL(req, paths_1.Paths.receiver.uri);
        const user = res.locals.user;
        OAuthHelper.storeStateCookie(req, res, user.id);
        return `${loginPath}/uplift?response_type=code&state=${user.id}&client_id=${clientId}&redirect_uri=${redirectUri}`;
    }
    static getStateCookie(req) {
        return req.cookies['state'];
    }
    static storeStateCookie(req, res, state) {
        const cookies = new Cookies(req, res);
        cookies.set('state', state);
    }
}
exports.OAuthHelper = OAuthHelper;
