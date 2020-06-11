"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandling {
    static apply(requestHandler) {
        return async (req, res, next) => {
            try {
                return await requestHandler(req, res, next);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.ErrorHandling = ErrorHandling;
