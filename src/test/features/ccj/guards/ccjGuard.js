"use strict";
/* tslint:disable:no-unused-expression */
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
const sinon_express_mock_1 = require("sinon-express-mock");
const paths_1 = require("dashboard/paths");
const draftCCJ_1 = require("ccj/draft/draftCCJ");
const ccjGuard_1 = require("ccj/guards/ccjGuard");
const yesNoOption_1 = require("models/yesNoOption");
chai.use(spies);
describe('CCJ guard', () => {
    const next = () => void 0;
    beforeEach(() => {
        sinon_express_mock_1.mockRes.locals = {
            user: {
                ccjDraft: new draftCCJ_1.DraftCCJ()
            }
        };
        sinon_express_mock_1.mockRes.redirect = sinon.spy(() => void 0);
    });
    it('should redirect to dashboard page when eligibleForCCJ is false', () => {
        sinon_express_mock_1.mockRes.locals.claim = { eligibleForCCJ: false };
        ccjGuard_1.CCJGuard.requestHandler(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockRes.redirect).to.have.been.calledWith(paths_1.Paths.dashboardPage.uri);
    });
    it('should redirect to dashboard page when admissionPayImmediatelyPastPaymentDate is false', () => {
        sinon_express_mock_1.mockRes.locals.claim = { admissionPayImmediatelyPastPaymentDate: false };
        ccjGuard_1.CCJGuard.requestHandler(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockRes.redirect).to.have.been.calledWith(paths_1.Paths.dashboardPage.uri);
    });
    it('should redirect to dashboard page when eligibleForCCJAfterBreachedSettlementTerms is false', () => {
        sinon_express_mock_1.mockRes.locals.claim = { eligibleForCCJAfterBreachedSettlementTerms: false };
        ccjGuard_1.CCJGuard.requestHandler(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockRes.redirect).to.have.been.calledWith(paths_1.Paths.dashboardPage.uri);
    });
    it('should redirect to dashboard page when paper response received', () => {
        sinon_express_mock_1.mockRes.locals.claim = { paperResponse: yesNoOption_1.YesNoOption.YES };
        ccjGuard_1.CCJGuard.requestHandler(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, next);
        chai.expect(sinon_express_mock_1.mockRes.redirect).to.have.been.calledWith(paths_1.Paths.dashboardPage.uri);
    });
    it('should pass when eligibleForCCJ, admissionPayImmediatelyPastPaymentDate, eligibleForCCJAfterBreachedSettlementTerms are true and no paper response received', () => {
        const spy = sinon.spy(next);
        sinon_express_mock_1.mockRes.locals.claim = {
            eligibleForCCJ: true,
            admissionPayImmediatelyPastPaymentDate: true,
            eligibleForCCJAfterBreachedSettlementTerms: true,
            paperResponse: yesNoOption_1.YesNoOption.NO
        };
        ccjGuard_1.CCJGuard.requestHandler(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, spy);
        chai.expect(spy).to.have.been.called;
    });
});
