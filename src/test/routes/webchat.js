"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webchat_1 = require("routes/webchat");
const chai_1 = require("chai");
const secrets = {
    'cmc-webchat-id': 1212121.234324,
    'cmc-webchat-tenant': 1212121.23214,
    'cmc-webchat-no-client': 1212121.324324,
    'different-secret': 1212121
};
const expectedSecrets = {
    'cmc-webchat-id': 1212121.234324,
    'cmc-webchat-tenant': 1212121.23214,
    'cmc-webchat-no-client': 1212121.324324
};
describe('webchat', async () => {
    describe('on filterSecrets', () => {
        it('should return only filtered secrets', async () => {
            const filterSecrets = webchat_1.WebChat.filterSecrets('cmc-webchat', secrets);
            chai_1.expect(filterSecrets).to.deep.eq(expectedSecrets);
        });
    });
});
