"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("offer/paths");
const errorHandling_1 = require("shared/errorHandling");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.rejectedPage.uri, errorHandling_1.ErrorHandling.apply(async (req, res, next) => {
    const claim = res.locals.claim;
    res.render(paths_1.Paths.rejectedPage.associatedView, {
        claim: claim
    });
}));
