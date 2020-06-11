"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const nameFormatter_1 = require("utils/nameFormatter");
describe('NameFormatter', () => {
    describe('fullName', () => {
        it('should format name from title, first and last name', () => {
            chai_1.expect(nameFormatter_1.NameFormatter.fullName('Coffee', 'McCoffee', 'Mr.')).to.eq('Mr. Coffee McCoffee');
        });
        it('should format name first and last name and no title', () => {
            chai_1.expect(nameFormatter_1.NameFormatter.fullName('Coffee', 'McCoffee', undefined)).to.eq('Coffee McCoffee');
            chai_1.expect(nameFormatter_1.NameFormatter.fullName('Coffee', 'McCoffee', '')).to.eq('Coffee McCoffee');
            chai_1.expect(nameFormatter_1.NameFormatter.fullName('Coffee', 'McCoffee', ' ')).to.eq('Coffee McCoffee');
            chai_1.expect(nameFormatter_1.NameFormatter.fullName('Coffee', 'McCoffee')).to.eq('Coffee McCoffee');
        });
    });
});
