"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const claimStoreClient_1 = require("claims/claimStoreClient");
const momentFormatter_1 = require("utils/momentFormatter");
const momentFactory_1 = require("shared/momentFactory");
const requestPromise = require("request-promise-native");
class CalendarClient {
    constructor(url = `${claimStoreClient_1.claimApiBaseUrl}/calendar/next-working-day`) {
        this.url = url;
    }
    getNextWorkingDayAfterDays(date, addDays) {
        if (!date) {
            return Promise.reject('Missing date');
        }
        return this.getNextWorkingDay(date.add(addDays, 'day'));
    }
    getNextWorkingDay(date) {
        if (!date) {
            return Promise.reject('Missing date');
        }
        const formattedDate = encodeURI(momentFormatter_1.MomentFormatter.formatDate(date));
        return requestPromise
            .get({
            json: true,
            uri: `${this.url}?date=${formattedDate}`
        })
            .then(res => {
            if (!res.nextWorkingDay) {
                throw new Error('Invalid next working day');
            }
            return momentFactory_1.MomentFactory.parse(res.nextWorkingDay);
        })
            .catch(error => {
            throw new Error(`Unable to get next working day - ${error}`);
        });
    }
}
exports.CalendarClient = CalendarClient;
