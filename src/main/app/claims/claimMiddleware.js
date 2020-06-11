"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreClient_1 = require("claims/claimStoreClient");
const uuidUtils_1 = require("shared/utils/uuidUtils");
const claimStoreClient = new claimStoreClient_1.ClaimStoreClient();
class ClaimMiddleware {
    static retrieveByExternalId(req, res, next) {
        // req.params isn't populated here https://github.com/expressjs/express/issues/2088
        const externalId = uuidUtils_1.UUIDUtils.extractFrom(req.path);
        const user = res.locals.user;
        claimStoreClient.retrieveByExternalId(externalId, user)
            .then((claim) => {
            res.locals.claim = claim;
            next();
        })
            .catch(next);
    }
}
exports.ClaimMiddleware = ClaimMiddleware;
