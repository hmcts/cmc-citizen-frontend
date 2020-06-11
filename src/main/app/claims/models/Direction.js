"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const momentFactory_1 = require("shared/momentFactory");
var Direction;
(function (Direction) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        let directions = [];
        _.each(input, function (eachDirection) {
            directions.push({
                directionParty: eachDirection.directionParty,
                directionType: eachDirection.directionType,
                directionHeaderType: eachDirection.directionHeaderType,
                directionActionedDate: eachDirection.directionActionedDate ? momentFactory_1.MomentFactory.parse(eachDirection.directionActionedDate) : null,
                directionComment: eachDirection.directionHeaderType,
                extraDocuments: eachDirection.directionHeaderType
            });
        });
        return directions;
    }
    Direction.deserialize = deserialize;
})(Direction = exports.Direction || (exports.Direction = {}));
