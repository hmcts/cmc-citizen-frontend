"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("claimant-response/paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.notImplementedYetPage.uri, (req, res) => {
    res.render('not-implemented-yet');
});
