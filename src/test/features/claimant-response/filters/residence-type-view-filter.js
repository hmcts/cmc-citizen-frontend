"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const residence_type_view_filter_1 = require("claimant-response/filters/residence-type-view-filter");
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
describe('Residence type view filter', () => {
    residenceType_1.ResidenceType.all()
        .forEach(type => {
        it(`should map '${type.value}' to '${type.displayValue}'`, () => {
            chai_1.expect(residence_type_view_filter_1.ResidenceTypeViewFilter.render(type.value)).to.equal(type.displayValue);
        });
    });
    it('should throw an error for anything else', () => {
        chai_1.expect(() => residence_type_view_filter_1.ResidenceTypeViewFilter.render('IGLOO')).to.throw(TypeError);
    });
    it('should throw an error for null', () => {
        chai_1.expect(() => residence_type_view_filter_1.ResidenceTypeViewFilter.render(null)).to.throw(TypeError);
    });
});
