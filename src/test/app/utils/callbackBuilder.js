"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const sinon_express_mock_1 = require("sinon-express-mock");
const callbackBuilder_1 = require("utils/callbackBuilder");
describe('CallbackBuilder', () => {
    describe(`buildURL should create URL `, () => {
        it('for SSL request ', () => {
            const path = 'my/service/path';
            const expected = `https://localhost/${path}`;
            sinon_express_mock_1.mockReq.secure = true;
            sinon_express_mock_1.mockReq.headers = { host: 'localhost' };
            let url = callbackBuilder_1.buildURL(sinon_express_mock_1.mockReq, path);
            chai_1.expect(url.length).gt(0);
            chai_1.expect(url).to.eq(expected);
        });
        it('for non SSL request ', () => {
            const path = 'my/service/path';
            const expected = `https://localhost/${path}`;
            sinon_express_mock_1.mockReq.secure = false;
            sinon_express_mock_1.mockReq.headers = { host: 'localhost' };
            let url = callbackBuilder_1.buildURL(sinon_express_mock_1.mockReq, path);
            chai_1.expect(url.length).gt(0);
            chai_1.expect(url).to.eq(expected);
        });
    });
    describe(`buildURL should throw error `, () => {
        it('for undefined request ', () => {
            const path = 'my/service/path';
            chai_1.expect(() => callbackBuilder_1.buildURL(undefined, path)).to.throw(Error, 'Request is undefined');
        });
        it('for null path ', () => {
            sinon_express_mock_1.mockReq.secure = false;
            sinon_express_mock_1.mockReq.headers = { host: 'localhost' };
            chai_1.expect(() => callbackBuilder_1.buildURL(sinon_express_mock_1.mockReq, null)).to.throw(Error, 'Path null or undefined');
        });
        it('for empty path ', () => {
            sinon_express_mock_1.mockReq.secure = false;
            sinon_express_mock_1.mockReq.headers = { host: 'localhost' };
            chai_1.expect(() => callbackBuilder_1.buildURL(sinon_express_mock_1.mockReq, '')).to.throw(Error, 'Path null or undefined');
        });
        it('for undefined path ', () => {
            sinon_express_mock_1.mockReq.secure = false;
            sinon_express_mock_1.mockReq.headers = { host: 'localhost' };
            chai_1.expect(() => callbackBuilder_1.buildURL(sinon_express_mock_1.mockReq, undefined)).to.throw(Error, 'Path null or undefined');
        });
    });
});
