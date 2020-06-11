"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const documentsClient_1 = require("documents/documentsClient");
const downloadUtils_1 = require("utils/downloadUtils");
const documentsClient = new documentsClient_1.DocumentsClient();
class SealedClaimPdfGenerator {
    /**
     * Handles sealed claim downloads
     *
     * Note: Middleware expects to have {@link Claim} available in {@link express.Response.locals}
     *
     * @param {e.Request} req HTTP request
     * @param {e.Response} res HTTP response
     * @returns {Promise<void>}
     */
    static async requestHandler(req, res) {
        const claim = res.locals.claim;
        const pdf = await documentsClient.getSealedClaimPDF(claim.externalId, res.locals.user.bearerToken);
        downloadUtils_1.DownloadUtils.downloadPDF(res, pdf, `${claim.claimNumber}-claim`);
    }
}
exports.SealedClaimPdfGenerator = SealedClaimPdfGenerator;
