"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
require("test/routes/expectations");
const app_1 = require("main/app");
const chai_1 = require("chai");
const errors_1 = require("errors");
class ErrorStub {
    withStatusCode(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
    withAssociatedView(associatedView) {
        this.associatedView = associatedView;
        return this;
    }
}
class ResponseStub {
    status(statusValue) {
        this.statusValue = statusValue;
    }
    render(renderValue) {
        this.renderValue = renderValue;
    }
    redirect(redirectValue) {
        this.redirectValue = redirectValue;
    }
}
const next = () => undefined;
describe('Error handling', () => {
    let res;
    beforeEach(() => {
        res = new ResponseStub();
    });
    it('should map an error with no status code to a 500', () => {
        app_1.errorHandler(new ErrorStub(), {}, res, next);
        chai_1.expect(res.statusValue).to.equal(500);
        chai_1.expect(res.renderValue.startsWith('error')).to.be.true;
        chai_1.expect(res.redirectValue).to.be.undefined;
    });
    it('should redirect on a 302 with an associated view', () => {
        app_1.errorHandler(new ErrorStub().withStatusCode(302).withAssociatedView('shouldRedirectHere'), {}, res, next);
        chai_1.expect(res.statusValue).to.equal(302);
        chai_1.expect(res.renderValue).to.be.undefined;
        chai_1.expect(res.redirectValue).to.equal('shouldRedirectHere');
    });
    it('should redirect to an associated view when defined and not 302', () => {
        app_1.errorHandler(new ErrorStub().withStatusCode(418).withAssociatedView('associatedView'), {}, res, next);
        chai_1.expect(res.statusValue).to.equal(418);
        chai_1.expect(res.renderValue).to.equal('associatedView');
        chai_1.expect(res.redirectValue).to.be.undefined;
    });
    it('should render the forbidden view for 403', () => {
        app_1.errorHandler(new ErrorStub().withStatusCode(403), {}, res, next);
        chai_1.expect(res.statusValue).to.equal(403);
        chai_1.expect(res.renderValue).to.equal(new errors_1.ForbiddenError().associatedView);
        chai_1.expect(res.redirectValue).to.be.undefined;
    });
});
