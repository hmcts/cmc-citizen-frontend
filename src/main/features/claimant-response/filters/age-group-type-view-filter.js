"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dependant_1 = require("claims/models/response/statement-of-means/dependant");
var AgeGroupTypeViewFilter;
(function (AgeGroupTypeViewFilter) {
    function render(value) {
        switch (value) {
            case dependant_1.AgeGroupType.UNDER_11:
                return 'under 11';
            case dependant_1.AgeGroupType.BETWEEN_11_AND_15:
                return '11 to 15';
            case dependant_1.AgeGroupType.BETWEEN_16_AND_19:
                return '16 to 19';
        }
    }
    AgeGroupTypeViewFilter.render = render;
})(AgeGroupTypeViewFilter = exports.AgeGroupTypeViewFilter || (exports.AgeGroupTypeViewFilter = {}));
