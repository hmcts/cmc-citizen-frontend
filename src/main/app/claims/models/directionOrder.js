"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const Direction_1 = require("claims/models/Direction");
const momentFactory_1 = require("shared/momentFactory");
var DirectionOrder;
(function (DirectionOrder) {
    function deserialize(input) {
        if (!input) {
            return input;
        }
        return {
            createdOn: momentFactory_1.MomentFactory.parse(input.createdOn),
            hearingCourtName: input.hearingCourtName,
            hearingCourtAddress: input.hearingCourtAddress,
            directions: Direction_1.Direction.deserialize(input.directions),
            extraDocUploadList: input.extraDocUploadList,
            paperDetermination: input.paperDetermination,
            newRequestedCourt: input.newRequestedCourt,
            preferredDQCourt: input.preferredDQCourt,
            preferredCourtObjectingReason: input.preferredCourtObjectingReason,
            hearingCourt: input.hearingCourt,
            estimatedHearingDuration: input.estimatedHearingDuration,
            postDocumentsLastDay: getPostDocumentsLastDay(input.directions)
        };
    }
    DirectionOrder.deserialize = deserialize;
    function getPostDocumentsLastDay(directions) {
        const directionActionedDates = directions.map(direction => moment(direction.directionActionedDate));
        return moment.max(directionActionedDates);
    }
    DirectionOrder.getPostDocumentsLastDay = getPostDocumentsLastDay;
    function isReviewOrderEligible(deadline) {
        if (!deadline) {
            return false;
        }
        return momentFactory_1.MomentFactory.currentDateTime().isBefore(deadline.set({ h: 16, m: 0 }));
    }
    DirectionOrder.isReviewOrderEligible = isReviewOrderEligible;
})(DirectionOrder = exports.DirectionOrder || (exports.DirectionOrder = {}));
