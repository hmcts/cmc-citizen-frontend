"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const errorHandling_1 = require("shared/errorHandling");
const chai = require("chai");
const sinon = require("sinon");
const spies = require("sinon-chai");
const sinon_express_mock_1 = require("sinon-express-mock");
chai.use(spies);
const expect = chai.expect;
describe('ErrorHandling', () => {
    const resolvingRequestHandler = sinon.spy((req, res, next) => {
        return undefined;
    });
    const rejectingRequestHandler = sinon.spy((req, res, next) => {
        throw new Error('An error occurred');
    });
    const nextFunction = sinon.spy(() => {
        // Nothing to do, I'm a mock
    });
    it('should invoke given request handler', async () => {
        const handled = errorHandling_1.ErrorHandling.apply(resolvingRequestHandler);
        // @ts-ignore
        await handled(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, nextFunction);
        expect(resolvingRequestHandler).to.have.been.calledWith(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, nextFunction);
    });
    it('should not invoke next function when the request handler is successful', async () => {
        const handled = errorHandling_1.ErrorHandling.apply(resolvingRequestHandler);
        // @ts-ignore
        await handled(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, nextFunction);
        expect(nextFunction).to.have.not.been.called;
    });
    it('should invoke next function when the request handler has failed', async () => {
        const handled = errorHandling_1.ErrorHandling.apply(rejectingRequestHandler);
        // @ts-ignore
        await handled(sinon_express_mock_1.mockReq, sinon_express_mock_1.mockRes, nextFunction);
        expect(nextFunction).to.have.been.called;
    });
});
