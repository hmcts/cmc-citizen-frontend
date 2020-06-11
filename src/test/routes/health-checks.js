"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const request = require("supertest");
require("test/routes/expectations");
const app_1 = require("main/app");
describe('testing liveness', () => {
    it('should return 200 OK', async () => {
        await request(app_1.app)
            .get('/health/liveness')
            .expect(res => {
            chai_1.expect(res.status).equal(200);
            chai_1.expect(res.body.status).equal('UP');
        });
    });
});
