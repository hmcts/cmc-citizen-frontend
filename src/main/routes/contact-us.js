"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const paths_1 = require("paths");
/* tslint:disable:no-default-export */
exports.default = express.Router()
    .get(paths_1.Paths.contactUsPage.uri, (req, res) => {
    res.render(paths_1.Paths.contactUsPage.associatedView);
});
