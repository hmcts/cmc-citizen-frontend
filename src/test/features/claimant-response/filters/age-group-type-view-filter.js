"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-expression */
const chai_1 = require("chai");
const age_group_type_view_filter_1 = require("claimant-response/filters/age-group-type-view-filter");
const dependant_1 = require("claims/models/response/statement-of-means/dependant");
describe('Age group type view filter', () => {
    it("should map 'UNDER_11' to 'under 11'", () => {
        chai_1.expect(age_group_type_view_filter_1.AgeGroupTypeViewFilter.render(dependant_1.AgeGroupType.UNDER_11)).to.equal('under 11');
    });
    it("should map 'BETWEEN_11_AND_15' to '11 to 15'", () => {
        chai_1.expect(age_group_type_view_filter_1.AgeGroupTypeViewFilter.render(dependant_1.AgeGroupType.BETWEEN_11_AND_15)).to.equal('11 to 15');
    });
    it("should map 'BETWEEN_16_AND_19' to '16 to 19'", () => {
        chai_1.expect(age_group_type_view_filter_1.AgeGroupTypeViewFilter.render(dependant_1.AgeGroupType.BETWEEN_16_AND_19)).to.equal('16 to 19');
    });
    it('should map any other value to undefined', () => {
        chai_1.expect(age_group_type_view_filter_1.AgeGroupTypeViewFilter.render('OVER_19')).to.be.undefined;
    });
    it('should map null to undefined', () => {
        chai_1.expect(age_group_type_view_filter_1.AgeGroupTypeViewFilter.render(null)).to.be.undefined;
    });
});
