"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("eligibility/paths");
const jwtExtractor_1 = require("idam/jwtExtractor");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.startPage.uri, (req, res) => {
    res.render(paths_1.Paths.startPage.associatedView, {
        registeredUser: jwtExtractor_1.JwtExtractor.extract(req) !== undefined
    });
});
