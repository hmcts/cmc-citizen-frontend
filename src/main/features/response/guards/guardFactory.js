"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GuardFactory {
    static create(isAllowed, accessDeniedCallback) {
        return (req, res, next) => {
            if (isAllowed(res)) {
                next();
            }
            else {
                accessDeniedCallback(req, res);
            }
        };
    }
    static createAsync(isAllowed, accessDeniedCallback) {
        return async (req, res, next) => {
            try {
                if (await isAllowed(req, res)) {
                    next();
                }
                else {
                    accessDeniedCallback(req, res);
                }
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.GuardFactory = GuardFactory;
