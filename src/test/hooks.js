"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mock = require("nock");
const idamServiceMock = require("test/http-mocks/idam");
function attachDefaultHooks() {
    let retrieveServiceTokenMock;
    beforeEach(() => {
        mock.cleanAll();
        retrieveServiceTokenMock = idamServiceMock.resolveRetrieveServiceToken();
    });
    afterEach(() => {
        const pendingMocks = mock.pendingMocks().filter(item => item !== retrieveServiceTokenMock.interceptors[0]._key);
        chai_1.expect(pendingMocks, 'At least one mock were declared but not used').to.be.deep.equal([]);
    });
}
exports.attachDefaultHooks = attachDefaultHooks;
