"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const preconditions_1 = require("shared/preconditions");
describe('Preconditions', () => {
    describe('checkDefined', () => {
        it('should throw an error when value is undefined', () => {
            chai_1.expect(() => {
                preconditions_1.checkDefined(undefined, 'Value is required');
            }).to.throw(Error, 'Value is required');
        });
        it('should throw an error when value is null', () => {
            chai_1.expect(() => {
                preconditions_1.checkDefined(null, 'Value is required');
            }).to.throw(Error, 'Value is required');
        });
        it('should not throw an error when value is defined', () => {
            chai_1.expect(() => {
                preconditions_1.checkDefined({}, 'Value is required');
            }).to.not.throw(Error);
        });
    });
    describe('checkNotEmpty', () => {
        it('should throw an error when value is undefined', () => {
            chai_1.expect(() => {
                preconditions_1.checkNotEmpty(undefined, 'Value cannot be empty');
            }).to.throw(Error, 'Value cannot be empty');
        });
        it('should throw an error when value is null', () => {
            chai_1.expect(() => {
                preconditions_1.checkNotEmpty(null, 'Value cannot be empty');
            }).to.throw(Error, 'Value cannot be empty');
        });
        describe('array argument', () => {
            it('should throw an error when value is empty', () => {
                chai_1.expect(() => {
                    preconditions_1.checkNotEmpty([], 'Value cannot be empty');
                }).to.throw(Error, 'Value cannot be empty');
            });
            it('should not throw an error when value is not empty', () => {
                chai_1.expect(() => {
                    preconditions_1.checkNotEmpty(['test'], 'Value cannot be empty');
                }).to.not.throw(Error);
            });
        });
        describe('string argument', () => {
            it('should throw an error when value is empty', () => {
                chai_1.expect(() => {
                    preconditions_1.checkNotEmpty('', 'Value cannot be empty');
                }).to.throw(Error, 'Value cannot be empty');
            });
            it('should not throw an error when value is not empty', () => {
                chai_1.expect(() => {
                    preconditions_1.checkNotEmpty('test', 'Value cannot be empty');
                }).to.not.throw(Error);
            });
        });
    });
});
