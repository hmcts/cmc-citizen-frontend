"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const moment = require("moment");
const dateFilter_1 = require("modules/nunjucks/filters/dateFilter");
const calculateMonthIncrement_1 = require("common/calculate-month-increment/calculateMonthIncrement");
describe('dateFilter', () => {
    it('formats date (moment object) properly', () => {
        chai_1.expect(dateFilter_1.dateFilter(moment('2017-01-01'))).to.eq('1 January 2017');
    });
    it('formats date (string) properly', () => {
        chai_1.expect(dateFilter_1.dateFilter('2017-01-01')).to.eq('1 January 2017');
    });
    it('formats date properly (object with time)', () => {
        chai_1.expect(dateFilter_1.dateFilter(moment('2017-01-01 12:12:12'))).to.eq('1 January 2017');
    });
    describe('throws exception when', () => {
        it('null given', () => {
            expectDateFilterToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty');
        });
        it('undefined given', () => {
            expectDateFilterToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty');
        });
        it('empty string given', () => {
            expectDateFilterToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty');
        });
        it('number given', () => {
            expectDateFilterToThrowErrorWithMsg(1.01, 'Input should be moment or string, cannot be empty');
        });
        it('string given, but it is not a valid date', () => {
            expectDateFilterToThrowErrorWithMsg('this is invalid date', 'Invalid date');
        });
        it('moment given with invalid date', () => {
            const invalidDateMoment = moment('2010-02-31');
            expectDateFilterToThrowErrorWithMsg(invalidDateMoment, 'Invalid date');
        });
    });
});
describe('dateInputFilter', () => {
    it('formats date (moment object) properly', () => {
        chai_1.expect(dateFilter_1.dateInputFilter(moment('2017-01-01'))).to.eq('1 1 2017');
    });
    it('formats date (string) properly', () => {
        chai_1.expect(dateFilter_1.dateInputFilter('2017-01-01')).to.eq('1 1 2017');
    });
    it('formats date properly (object with time)', () => {
        chai_1.expect(dateFilter_1.dateInputFilter(moment('2017-01-01 12:12:12'))).to.eq('1 1 2017');
    });
    describe('throws exception when', () => {
        it('null given', () => {
            expectInputDateFilterToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty');
        });
        it('undefined given', () => {
            expectInputDateFilterToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty');
        });
        it('empty string given', () => {
            expectInputDateFilterToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty');
        });
        it('number given', () => {
            expectInputDateFilterToThrowErrorWithMsg(1.01, 'Input should be moment or string, cannot be empty');
        });
        it('string given, but it is not a valid date', () => {
            expectInputDateFilterToThrowErrorWithMsg('this is invalid date', 'Invalid date');
        });
        it('moment given with invalid date', () => {
            const invalidDateMoment = moment('2010-02-31');
            expectInputDateFilterToThrowErrorWithMsg(invalidDateMoment, 'Invalid date');
        });
    });
});
describe('dateWithDayAtFront', () => {
    it('formats date (moment object) properly', () => {
        chai_1.expect(dateFilter_1.dateWithDayAtFrontFilter(moment('2017-01-01'))).to.eq('Sunday 1 January 2017');
    });
    it('formats date (string) properly', () => {
        chai_1.expect(dateFilter_1.dateWithDayAtFrontFilter('2017-01-01')).to.eq('Sunday 1 January 2017');
    });
    it('formats date properly (object with time)', () => {
        chai_1.expect(dateFilter_1.dateWithDayAtFrontFilter(moment('2017-01-01 12:12:12'))).to.eq('Sunday 1 January 2017');
    });
    describe('throws exception when', () => {
        it('null given', () => {
            dateWithDayAtFrontFilterToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty');
        });
        it('undefined given', () => {
            dateWithDayAtFrontFilterToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty');
        });
        it('empty string given', () => {
            dateWithDayAtFrontFilterToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty');
        });
        it('number given', () => {
            dateWithDayAtFrontFilterToThrowErrorWithMsg(1.01, 'Input should be moment or string, cannot be empty');
        });
        it('string given, but it is not a valid date', () => {
            dateWithDayAtFrontFilterToThrowErrorWithMsg('this is invalid date', 'Invalid date');
        });
        it('moment given with invalid date', () => {
            const invalidDateMoment = moment('2010-02-31');
            dateWithDayAtFrontFilterToThrowErrorWithMsg(invalidDateMoment, 'Invalid date');
        });
    });
});
describe('addDaysFilter', () => {
    it('adds days to a moment', () => {
        chai_1.expect(dateFilter_1.addDaysFilter(moment('2018-01-01'), 1).toJSON()).to.eq(moment('2018-01-02').toJSON());
    });
    it('adds days to a valid string', () => {
        chai_1.expect(dateFilter_1.addDaysFilter('2018-01-1', 10).toJSON()).to.eq(moment('2018-01-11').toJSON());
    });
    it('adds negative days', () => {
        chai_1.expect(dateFilter_1.addDaysFilter('2018-01-01', -1).toJSON()).to.eq(moment('2017-12-31').toJSON());
    });
    it('adds days to "now"', () => {
        const tomorrow = moment().add(1, 'day');
        chai_1.expect(dateFilter_1.addDaysFilter('now', 1).date()).to.eq(tomorrow.date());
        chai_1.expect(dateFilter_1.addDaysFilter('now', 1).month()).to.eq(tomorrow.month());
        chai_1.expect(dateFilter_1.addDaysFilter('now', 1).year()).to.eq(tomorrow.year());
    });
    it('adds days to moment object - immutable', () => {
        const plus2days = moment();
        plus2days.add(2, 'days');
        const input = moment();
        chai_1.expect(dateFilter_1.addDaysFilter(input, 2).diff(plus2days, 'days')).to.eq(0);
        chai_1.expect(input.diff(moment(), 'days')).to.eq(0);
    });
    describe('throws exception when', () => {
        it('null given', () => {
            expectAddDaysFilterToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty');
        });
        it('undefined given', () => {
            expectAddDaysFilterToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty');
        });
        it('empty string given', () => {
            expectAddDaysFilterToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty');
        });
        it('number given', () => {
            expectAddDaysFilterToThrowErrorWithMsg(1.01, 'Input should be moment or string, cannot be empty');
        });
        it('string given, but it is not a valid date', () => {
            expectAddDaysFilterToThrowErrorWithMsg('this is invalid date', 'Invalid date');
        });
        it('moment given with invalid date', () => {
            const invalidDateMoment = moment('2010-02-31');
            expectAddDaysFilterToThrowErrorWithMsg(invalidDateMoment, 'Invalid date');
        });
    });
});
describe('monthIncrementFilter', () => {
    it('adds monthly increment to a moment', () => {
        chai_1.expect(dateFilter_1.monthIncrementFilter(moment('2018-01-01')).toJSON()).to.eq(moment('2018-02-01').toJSON());
    });
    it('adds monthly increment to a valid string', () => {
        chai_1.expect(dateFilter_1.monthIncrementFilter('2018-01-01').toJSON()).to.eq(moment('2018-02-01').toJSON());
    });
    it('adds monthly increment to "now"', () => {
        const monthlyIncrement = calculateMonthIncrement_1.calculateMonthIncrement(moment());
        chai_1.expect(dateFilter_1.monthIncrementFilter('now').format(moment.HTML5_FMT.DATETIME_LOCAL))
            .to.eq(monthlyIncrement.format(moment.HTML5_FMT.DATETIME_LOCAL));
    });
    describe('throws exception when', () => {
        it('null given', () => {
            expectMonthIncrementToThrowErrorWithMsg(null, 'Input should be moment or string, cannot be empty');
        });
        it('undefined given', () => {
            expectMonthIncrementToThrowErrorWithMsg(undefined, 'Input should be moment or string, cannot be empty');
        });
        it('empty string given', () => {
            expectMonthIncrementToThrowErrorWithMsg('', 'Input should be moment or string, cannot be empty');
        });
        it('number given', () => {
            expectMonthIncrementToThrowErrorWithMsg(1.01, 'Input should be moment or string, cannot be empty');
        });
        it('string given, but it is not a valid date', () => {
            expectMonthIncrementToThrowErrorWithMsg('this is invalid date', 'Invalid date');
        });
        it('moment given with invalid date', () => {
            const invalidDateMoment = moment('2010-02-31');
            expectMonthIncrementToThrowErrorWithMsg(invalidDateMoment, 'Invalid date');
        });
    });
});
function expectDateFilterToThrowErrorWithMsg(input, msg) {
    chai_1.expect(() => {
        dateFilter_1.dateFilter(input);
    }).to.throw(Error, msg);
}
function expectInputDateFilterToThrowErrorWithMsg(input, msg) {
    chai_1.expect(() => {
        dateFilter_1.dateInputFilter(input);
    }).to.throw(Error, msg);
}
function expectAddDaysFilterToThrowErrorWithMsg(input, msg) {
    chai_1.expect(() => {
        dateFilter_1.addDaysFilter(input, 1);
    }).to.throw(Error, msg);
}
function expectMonthIncrementToThrowErrorWithMsg(input, msg) {
    chai_1.expect(() => {
        dateFilter_1.monthIncrementFilter(input);
    }).to.throw(Error, msg);
}
function dateWithDayAtFrontFilterToThrowErrorWithMsg(input, msg) {
    chai_1.expect(() => {
        dateFilter_1.dateWithDayAtFrontFilter(input);
    }).to.throw(Error, msg);
}
