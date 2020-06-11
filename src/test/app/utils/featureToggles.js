"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const config = require("config");
const toBoolean = require("to-boolean");
const featureToggles_1 = require("utils/featureToggles");
describe('FeatureToggles', () => {
    describe('isAnyEnabled', () => {
        it('should throw an error when no toggle names are provided', () => {
            chai_1.expect(() => featureToggles_1.FeatureToggles.isAnyEnabled()).to.throw(Error);
        });
        it('should throw an error if toggle does not exist', () => {
            chai_1.expect(() => featureToggles_1.FeatureToggles.isAnyEnabled('one', 'two', 'three')).to.throw(Error);
        });
    });
    describe('isEnabled', () => {
        it('should return toggle value if testingSupport toggle exists', () => {
            const expectedToggleValue = toBoolean(config.get(`featureToggles.testingSupport`));
            chai_1.expect(featureToggles_1.FeatureToggles.isEnabled('testingSupport')).to.equal(expectedToggleValue);
        });
        it('should throw an error if toggle does not exist', () => {
            chai_1.expect(() => featureToggles_1.FeatureToggles.isEnabled('I am not a valid toggle name')).to.throw(Error);
        });
    });
});
