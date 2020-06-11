"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const madeBy_1 = require("claims/models/madeBy");
var ReDetermination;
(function (ReDetermination) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        return {
            explanation: input.explanation,
            partyType: madeBy_1.MadeBy.valueOf(input.partyType)
        };
    }
    ReDetermination.deserialize = deserialize;
})(ReDetermination = exports.ReDetermination || (exports.ReDetermination = {}));
