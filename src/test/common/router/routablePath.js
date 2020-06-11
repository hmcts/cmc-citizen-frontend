"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const routablePath_1 = require("shared/router/routablePath");
describe('RoutablePath', () => {
    describe('providing uri', () => {
        it('should strip index from the end of the uri', () => {
            chai_1.expect(new routablePath_1.RoutablePath('/response/index').uri).to.be.equal('/response');
        });
        it('should not strip index from the middle of the uri', () => {
            chai_1.expect(new routablePath_1.RoutablePath('/response/index-type').uri).to.be.equal('/response/index-type');
        });
    });
    describe('evaluating uri', () => {
        it('should fail when substitutions is not provided', () => {
            [undefined, {}].forEach(invalidValue => {
                chai_1.expect(() => new routablePath_1.RoutablePath('/case/:externalId/payment/:payment-type').evaluateUri(invalidValue))
                    .to.throw(Error, 'Path parameter substitutions are required');
            });
        });
        it('should fail when not all path parameter placeholders has been replaced', () => {
            chai_1.expect(() => new routablePath_1.RoutablePath('/case/:id/payment/:payment-type').evaluateUri({ id: '999' }))
                .to.throw(Error, 'Path parameter substitutions for :payment-type are missing');
        });
        it('should fail when not all path parameter substitutions has been used', () => {
            chai_1.expect(() => new routablePath_1.RoutablePath('/case/:id').evaluateUri({ id: '999', foo: 'bar' }))
                .to.throw(Error, 'Path parameter :foo is not defined');
        });
        it('should replace all path parameter placeholders', () => {
            chai_1.expect(new routablePath_1.RoutablePath('/case/:id/payment/:payment-type').evaluateUri({ id: '999', 'payment-type': 'card' }))
                .to.be.equal('/case/999/payment/card');
        });
        it('should fail when path parameter placeholder has invalid value', () => {
            [{ id: undefined }, { id: null }, { id: 'null' }, { id: 'undefined' }, { id: '' }].forEach(invalidValue => {
                chai_1.expect(() => new routablePath_1.RoutablePath('/case/:id/payment').evaluateUri(invalidValue))
                    .to.throw(Error, 'Path parameter :id is invalid');
            });
        });
    });
    describe('finding associated view', () => {
        describe('for features', () => {
            it('should return path within feature directory structure', () => {
                chai_1.expect(new routablePath_1.RoutablePath('/response/response-type').associatedView).to.be.equal('response/views/response-type');
                chai_1.expect(new routablePath_1.RoutablePath('/response/free-mediation/warning').associatedView).to.be.equal('response/views/free-mediation/warning');
            });
            it('should strip any path parameters', () => {
                chai_1.expect(new routablePath_1.RoutablePath('/claim/:externalId/confirmation').associatedView).to.be.equal('claim/views/confirmation');
                chai_1.expect(new routablePath_1.RoutablePath('/claim/:type/:subtype/list').associatedView).to.be.equal('claim/views/list');
            });
            it('should remove case from view path', () => {
                chai_1.expect(new routablePath_1.RoutablePath('/case/:externalId/claim/confirmation').associatedView).to.be.equal('claim/views/confirmation');
            });
        });
        describe('for others', () => {
            it('should return path within main directory structure', () => {
                chai_1.expect(new routablePath_1.RoutablePath('/claim/start', false).associatedView).to.be.equal('claim/start');
                chai_1.expect(new routablePath_1.RoutablePath('/claim/defendant/name', false).associatedView).to.be.equal('claim/defendant/name');
            });
            it('should strip any path parameters', () => {
                chai_1.expect(new routablePath_1.RoutablePath('/claim/:externalId/confirmation', false).associatedView).to.be.equal('claim/confirmation');
                chai_1.expect(new routablePath_1.RoutablePath('/claim/:type/:subtype/list', false).associatedView).to.be.equal('claim/list');
            });
        });
    });
});
