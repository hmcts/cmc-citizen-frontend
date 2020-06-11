"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const residenceType_1 = require("response/form/models/statement-of-means/residenceType");
var ResidenceTypeViewFilter;
(function (ResidenceTypeViewFilter) {
    function render(value) {
        return residenceType_1.ResidenceType.valueOf(value).displayValue;
    }
    ResidenceTypeViewFilter.render = render;
})(ResidenceTypeViewFilter = exports.ResidenceTypeViewFilter || (exports.ResidenceTypeViewFilter = {}));
