"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const _ = require("lodash");
const eligibility_1 = require("eligibility/model/eligibility");
const minuteInMilliseconds = 60 * 1000;
const cookieTimeToLiveInMinutes = config.get('eligibility.cookie.timeToLiveInMinutes') * minuteInMilliseconds;
exports.cookieName = 'eligibility-check';
class CookieEligibilityStore {
    read(req, res) {
        const cookie = req.cookies[exports.cookieName];
        return new eligibility_1.Eligibility().deserialize(cookie !== undefined ? cookie : undefined);
    }
    write(eligibility, req, res) {
        const excludeDisplayValue = (value) => {
            const property = 'displayValue';
            if (value && typeof value === 'object' && Object.getOwnPropertyDescriptor(value, property)) {
                return _.omit(value, property);
            }
            return undefined;
        };
        res.cookie(exports.cookieName, _.cloneDeepWith(eligibility, excludeDisplayValue), { httpOnly: true, secure: true, maxAge: cookieTimeToLiveInMinutes });
    }
    clear(req, res) {
        res.clearCookie(exports.cookieName);
    }
}
exports.CookieEligibilityStore = CookieEligibilityStore;
