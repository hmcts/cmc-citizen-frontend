"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("orders/paths");
const errorHandling_1 = require("shared/errorHandling");
const momentFactory_1 = require("shared/momentFactory");
const calendarClient_1 = require("claims/calendarClient");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.confirmationPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const user = res.locals.user;
    const claim = res.locals.claim;
    res.render(paths_1.Paths.confirmationPage.associatedView, {
        otherParty: claim.otherPartyName(user),
        // todo:Below current date should be changed to directionsOrder.createdOn when other reconideration stories are merged to master
        deadline: await new calendarClient_1.CalendarClient().getNextWorkingDayAfterDays(momentFactory_1.MomentFactory.currentDate(), 12)
    });
}));
