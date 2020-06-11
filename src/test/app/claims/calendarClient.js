"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const momentFactory_1 = require("shared/momentFactory");
const chai_1 = require("chai");
const calendarClient_1 = require("claims/calendarClient");
const claim_store_1 = require("test/http-mocks/claim-store");
describe('calendar', () => {
    const SATURDAY = momentFactory_1.MomentFactory.parse('2019-06-29');
    const MONDAY_AFTER = '2019-06-29';
    let calendarClient;
    beforeEach(() => {
        calendarClient = new calendarClient_1.CalendarClient();
    });
    it('should return correct date when calendar api is called', async () => {
        claim_store_1.mockNextWorkingDay(SATURDAY);
        const nextWorkingDay = await calendarClient.getNextWorkingDay(SATURDAY);
        chai_1.expect(nextWorkingDay.toISOString()).to.equal(momentFactory_1.MomentFactory.parse(MONDAY_AFTER).toISOString());
    });
    it('should return Invalid next working day', async () => {
        claim_store_1.mockNextWorkingDay(undefined);
        calendarClient.getNextWorkingDay(SATURDAY)
            .then(undefined, rej => {
            chai_1.expect(rej.toString()).to.contains('Invalid next working day');
        });
    });
    it('should return Missing date error when no date is passed - getNextWorkingDayAfterDays', () => {
        claim_store_1.mockNextWorkingDay(SATURDAY);
        calendarClient.getNextWorkingDayAfterDays(undefined, 0)
            .then(undefined, rej => chai_1.expect(rej.toString()).to.contains('Missing date'));
    });
    it('should return Missing date error when no date is passed - getNextWorkingDay', () => {
        claim_store_1.mockNextWorkingDay(SATURDAY);
        calendarClient.getNextWorkingDay(undefined)
            .then(undefined, rej => chai_1.expect(rej.toString()).to.contains('Missing date'));
    });
    it('should return Unable to get next working day bad request', () => {
        claim_store_1.rejectNextWorkingDay(SATURDAY);
        calendarClient.getNextWorkingDay(SATURDAY)
            .catch(err => chai_1.expect(err.toString()).to.contains('Unable to get next working day'));
    });
});
